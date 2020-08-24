import React, { useState } from 'react'
import { Button } from '@material-ui/core'
import db from "../../firebase";
import storage from "../../firebase";
import firebase from "firebase";
import './ImageUpload.css';



function ImageUpload({username}) {
  const [image, setImage] = useState(null);
  // const [url, setUrl] = useState("");
  const [progress, setProgress] = useState(0)
  const [caption, setCaption] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }
  
  const handleUpload = (e) => {
    const uploadTask = storage.storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage.storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then(url => {
            db.db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          })
      }
    )
  }
  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />
      <input type="text" className="imageupload__textInput"　placeholder='投稿しよう！' onChange={event => setCaption(event.target.value)} value={caption} />
      <input type="file" className="imageupload__pictInput" onChange={handleChange} />
      <Button onClick={handleUpload}>
        アップロード
      </Button>
    </div>
  )
}

export default ImageUpload
