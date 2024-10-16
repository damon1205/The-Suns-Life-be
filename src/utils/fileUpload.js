const { sendResponse } = require("./responseHandler")
const aws = require("aws-sdk")
const path = require('path');
const fs = require('fs');

module.exports = {

    uploadFolder: async function (absolutePath, uploadFolderPath) {
        const config = {
            signatureVersion: 'v4',
            accessKeyId: process.env.S3ACCESSKEYID,
            secretAccessKey: process.env.S3ACCESSSECRET,
            region: process.env.S3REGION,
        }
        var s3 = new aws.S3(config);
        const BUCKET = process.env.S3BUCKET;


        const directoryToUpload = absolutePath;

        // get file paths
        const filePaths = [];
        const getFilePaths = (dir) => {
            fs.readdirSync(dir).forEach(function (name) {
                const filePath = path.join(dir, name);
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    filePaths.push(filePath);
                } else if (stat.isDirectory()) {
                    getFilePaths(filePath);
                }
            });
        };
        getFilePaths(directoryToUpload);

        // upload to S3
        const uploadToS3 = (dir, path) => {
            return new Promise((resolve, reject) => {
                const key = uploadFolderPath + "/" + path.split(`${dir}/`)[1];
                const params = {
                    Bucket: BUCKET,
                    Key: key,
                    Body: fs.readFileSync(path),
                };
                params.ACL = 'public-read';
                s3.putObject(params, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(path);
                    }
                });
            });
        };

        const uploadPromises = filePaths.map((path) =>
            uploadToS3(directoryToUpload, path)
        );
        return Promise.all(uploadPromises)
            .then((result) => {
                return result;
            })
            .catch((err) => console.error(err));
    },

    uploadMetaDataFile(file, file_name, path = '/defualt') {
        return new Promise((resolve, reject) => {
            if (Buffer.isBuffer(file) || (file && Buffer.isBuffer(file.buffer)) || String(file_name).includes('.json') || file.indexOf('data:') === 0) {
                file = Buffer.isBuffer(file) ? file : String(file_name).includes('.json') ? file : file.indexOf('data:') === 0 ? new Buffer(img_src.replace(/^data:\w+\/\w+;base64,/, ""), 'base64') : file.buffer;
                var data = {
                    Key: file_name,
                    Body: file,
                    Bucket: "path/to/your/bucket" + path,
                    CacheControl: 'no-cache'
                };


                if (file.indexOf('data:') === 0) {
                    data['ContentType'] = String(file).substr(file.indexOf('data:') + 'data:'.length, file.indexOf(';'))
                } else if (String(file_name).includes('.json')) {
                    data['ContentType'] = 'application/pdf';
                }

                s3.putObject(data, function (err, data) {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve({
                            name: file_name,
                            path: path
                        });
                    }
                });
            } else {
                return reject('File is required');
            }
        });
    },
    
    uploadMetaJson: async function (key, jsonObj) {
        const config = {
            signatureVersion: 'v4',
            accessKeyId: process.env.S3ACCESSKEYID,
            secretAccessKey: process.env.S3ACCESSSECRET,
            region: process.env.S3REGION,
        }
        const s3 = new aws.S3(config);
        const BUCKET = process.env.S3BUCKET;

        try {
            const bucketParams = {
                Bucket: BUCKET,
                Key: key,
                Body: jsonObj,
                ContentType: 'application/json; charset=utf-8'
            }
            bucketParams.ACL = 'public-read';

            let url = await s3.upload(bucketParams).promise();
            return url.Location
        }
        catch (error) {
            console.error("uploadMetaJson error", error);
        }

        return null

    },
    uploadFile: function (req, res) {

        let { key, content } = req.body

        key = key.split(" ").join("-")

        if (!key || !content) {
            res.status(400).json({
                status: 400,
                data: "please provide valid data"
            })
        } else {
            //? AWS Configs 
            const config = {
                signatureVersion: "v4",
                accessKeyId: process.env.s3AccessKeyId,
                secretAccessKey: process.env.s3AccessSecret,
                region: process.env.s3Region,
              };
              const s3 = new aws.S3(config);
              const BUCKET = process.env.s3Bucket;
            try {
                const contentType = content;
                const expireSeconds = 60 * 200;

                const bucketParams = {
                    Bucket: BUCKET,
                    Key: key,
                    ContentType: contentType,
                    Expires: expireSeconds,
                };

                bucketParams.ACL = 'public-read';

                const url = s3.getSignedUrl('putObject', bucketParams);

                if (url) {
                    sendResponse(res, 200, url, null)
                } else {
                    sendResponse(res, 400, null, "Unable to generate signed url")

                }
            } catch (error) {
                sendResponse(res, 500, null, "Internal Server Error")
            }
        }
    },
    uploadThumbnail: function (req, res) {

        const { thumbnailData } = req.body;
      
        if (!thumbnailData) {
          res.status(400).json({
            status: 400,
            data: "Please provide valid thumbnail data",
          });
        } else {
          // AWS Configs
          const config = {
            signatureVersion: "v4",
            accessKeyId: process.env.s3AccessKeyId,
            secretAccessKey: process.env.s3AccessSecret,
            region: process.env.s3Region,
          };
          const s3 = new aws.S3(config);
          const BUCKET = process.env.s3Bucket;
      
          try {
            // Convert the base64 thumbnail data to a buffer
            const thumbnailBuffer = Buffer.from(
              thumbnailData.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            );
      
            const key = 'thumbnails/thumbnail.jpg'; // The desired key/name of the thumbnail file in S3
      
            const bucketParams = {
              Bucket: BUCKET,
              Key: key,
              Body: thumbnailBuffer,
              ContentType: 'image/jpeg', // Change the content type based on the actual image type
              ACL: "public-read",
            };
      
            s3.upload(bucketParams, function (err, data) {
              if (err) {
                res.status(500).json({
                  status: 500,
                  data: "Error uploading thumbnail to S3",
                });
              } else {
                const thumbnailUrl = data.Location;
                res.status(200).json({
                  status: 200,
                  data: { thumbnailUrl },
                });
              }
            });
          } catch (error) {
            res.status(500).json({
              status: 500,
              data: "Internal Server Error",
            });
          }
        }
      }
      
}