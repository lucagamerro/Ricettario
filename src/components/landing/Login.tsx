import React from 'react';
import { useHistory } from "react-router-dom";
import firebase from 'firebase/app';

interface propsInt {
    setLog: Function
}

function Login(props: propsInt) {
    let h = useHistory();

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            h.push('/'); 
            props.setLog({logged: true, userId: uid});
        } else {
          //TODO registrati e poi entra (email di conferma?)
        }
    });

    const handleClick = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then((result: any) => {
            /** @type {firebase.auth.OAuthCredential} */
            // var credential = result.credential;
            // var token = credential.accessToken;
            // var user = result.user;
            // }
          }).catch((error) => {
            var errorCode = error.code;
            console.log(errorCode);
          });
    }

    return (
        <>
            <div className="container-fluid">
                <h1>Login</h1>
                <small className="text-muted">Effettua il login per continuare.</small>

                <br/><br/>  

                <div className="card border-primary mb-3">
                    <div className="card-body card-text">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" />
                        </div>
                        <div className="input-group">
                            <button  className="btn btn-outline-primary" onClick={handleClick}>Entra</button>    
                        </div>
                    </div>
                </div>        
            </div>
        </>
    )
}

export default Login;
