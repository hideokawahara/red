import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './components/Post/Post';
import db from './firebase';
import auth from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Button, Input } from '@material-ui/core';
import logo from './logo.png'
import ImageUpload from './components/ImageUpload/ImageUpload';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null)
   useEffect(() => {
     const unsubscribe = auth.auth.onAuthStateChanged((authUser) => {
       if (authUser) {
         console.log(authUser);
         setUser(authUser);
       } else {
         setUser(null);
       }
     });
     return () => {
       unsubscribe();
     };
   }, [user, username]);

  // 投稿が増えると下記のコードが動く
  useEffect(() => {
    // なぜこれがdbでいけないの？
    db.db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])
  
  const signUp = (event) => {
    event.preventDefault();
      auth
        .auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          return authUser.user.updateProfile({
            displayName: username,
          });
        })
        .catch((error) => alert(error.message));
    setOpen(false);
    alert('ご登録ありがとうございます！')
  }

  const signIn = (event) => {
    event.preventDefault();
    auth.auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
    alert('ログイン成功！')
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src={logo} alt="" />
            </center>
            <Input
              placeholder="名前"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="メールアドレス"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>
              新規登録
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage" src={logo} alt="" />
            </center>
            <Input
              placeholder="メールアドレス"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>
              ログイン
            </Button>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img className="app__headerImage" src={logo} alt="" />
        {user ? (
          <div className="app__loginContainer">
            <Button onClick={() => auth.auth.signOut()}>ログアウト</Button>
            <div className="headerUsername">{user.displayName}</div>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>ログイン</Button>
            <Button onClick={() => setOpen(true)}>新規登録</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div className="app__postsRight">
     
        </div>
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>投稿にはログインする必要があります</h3>
      )}
    </div>
  );
}

export default App;
