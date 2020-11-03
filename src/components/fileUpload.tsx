import React, { useState, useEffect, ReactEventHandler } from "react";
import UploadService from "../services/fileUpload";

export default () => {
    const [selectedFiles, setSelectedFiles] = useState(undefined);
    const [currentFile, setCurrentFile] = useState(undefined);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");

    const [fileInfos, setFileInfos] = useState([]);
    const selectFile = (event: any) => {
        setSelectedFiles(event.target.files);
    };

    const upload = () => {
        let currentFile = selectedFiles![0];

        setProgress(0);
        setCurrentFile(currentFile);

        UploadService.upload(currentFile, (event: any) => {
            setProgress(Math.round((100 * event.loaded) / event.total));
        })
            .then((response: any) => {
                setMessage(response.data.message);
                return UploadService.getFiles();
            })
            .then((files: any) => {
                setFileInfos(files.data);
            })
            .catch(() => {
                setProgress(0);
                setMessage("Could not upload the file!");
                setCurrentFile(undefined);
            });

        setSelectedFiles(undefined);
    };
    useEffect(() => {
        UploadService.getFiles().then((response:any) => {
          setFileInfos(response.data);
        });
      }, []);

    return (
        <div>
        {currentFile && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}
  
        <label className="btn btn-default">
          <input type="file" onChange={selectFile} />
        </label>
  
        <button
          className="btn btn-success"
          disabled={!selectedFiles}
          onClick={upload}
        >
          Upload
        </button>
  
        <div className="alert alert-light" role="alert">
          {message}
        </div>
  
        <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file: any, index) => (
                <li className="list-group-item" key={index}>
                  <a href={file.url}>{file.name}</a>
                </li>
              ))}
          </ul>
        </div>
      </div>
  );
};
