import React, { useState } from 'react';
import { Switch, Route } from "react-router-dom";
import loadable from '@loadable/component';
import firebase from 'firebase/app';    
import Eating from '../../style/eating.svg';
import LoginImg from '../../style/login.svg';

// import Login from './Login';
const Login = loadable(() =>  import('./Login')); 
// import Error from '../Error';
const Error = loadable(() =>  import('../Error')); 

interface propsInt {
    setLog: Function
}

function Welcome(props: propsInt) {
    var [cookie, setCookie] = useState(false)

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            var uid = user.uid;
            //TODO fai il login
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
          }).catch((error) => {
            var errorCode = error.code;
            console.log(errorCode);
            //TODO implementa errore
          });

          return;
    }

    return (
        <>
            <Switch>
                <Route exact path="/">  
                    <>
                        <section className="text-light" style={{backgroundColor: '#002233'}}>
                            <h1 className="display-4 fst-italic titolo-navigation">Ricettario</h1>
                            <small className="text-muted fst-italic">ricette ordinate sempre a portata di mano</small>
                            
                            <img src={Eating} className="mt-3 mb-3" width="85%" height="85%" alt="Persone al tavolo" />                            
                        </section>

                        {/* <section style={{backgroundColor: '#FFFFFF'}}>
                            <div className="container-fluid row mt-3">
                                <div className="col-sm-4">
                                    <img src={Document} className="mt-3 mb-3" width="100%" height="100%" alt="Documenti" />
                                </div>
                                <div className="col-sm-6 ms-3"> {/* //TODO cambia qrcode e finisci in generale 
                                    <h1>Tutto sincornizzato</h1>
                                    <small className="text-muted mb-3">Scarica l'app! (not yet available)</small>

                                    <br/><br/>
                                    
                                    <img alt="qrcode" src="data:image/png;base64,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"></img>
                                </div>
                            </div>
                        </section> */}
                        
                        <section className="text-light" style={{backgroundColor: '#FF9900'}}>
                            <h1 className="mt-5">Che aspetti? Accedi subito!</h1>
                            <small>Accetta i cookie per continuare.</small>
                            <button type="button" className="btn btn-outline-light mt-3" onClick={handleClick}>
                                Accedi con google
                            </button>

                            <img src={LoginImg} className="mt-3 mb-3" width="40%" height="40%" alt="Login" />                            
                            
                            <small className="mt-3">Per segnalazioni scrivere a lucagamerro.savemode@gmail.com</small>
                            {/* //TODO finisci pagina google e togli hidden*/}
                            <a className="text-muted" hidden href="https://lucagamerro.notion.site/Perch-google-66025d33eba2476ba35730159c22efcf" target="_blank" rel="noreferrer">Perchè google?</a>
                        </section>

                        {/* Created by <a href="https://github.com/lucagamerro" target="_blank" rel="noreferrer">@lucagamerro</a>. */}
 
                        <footer>
                            <div className="fixed-bottom text-muted ms-2 cookiebar">
                                <p hidden={cookie}>
                                    Questo sito utilizza <a href="https://www.garanteprivacy.it/faq/cookie" target="_blank" rel="noreferrer">cookie</a> tecnici, analytics e di terze parti. <br/>
                                    <button className="btn btn-link" onClick={() => {setCookie(true)}}>Accetto</button>
                                    <a type="button" className="btn btn-link" href="https://google.com/" rel="noreferrer">Rifiuto</a>
                                </p>
                            </div>
                        </footer>

                        {/* <div className="cookiebar">
                            <p>Questo sito utilizza cookie tecnici, analytics e di terze parti. <br/>Proseguendo nella navigazione accetti l’utilizzo dei cookie.</p>
                            <div className="cookiebar-buttons">
                                <a href="#" className="cookiebar-btn">Preferenze<span className="sr-only">cookies</span></a>
                                <button data-accept="cookiebar" className="cookiebar-btn cookiebar-confirm">Accetto<span className="sr-only"> i cookies</span></button>
                            </div>
                        </div> */}

                    </>
                </Route>

                <div className="container-fluid">
                    <Route exact path="/login"><Login setLog={props.setLog} /></Route>
                    <Route><Error /></Route>                  
                </div>
                
            </Switch> 
        </>
    );
}

export default Welcome;
