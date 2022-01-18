import React, { FC, useEffect, useState } from 'react';
import { store } from '../../database/firebase';
import { useParams, useHistory } from "react-router-dom";
import DOMPurify from 'dompurify';
import ButtonNuovo from 'bootstrap-icons/icons/trash.svg';
import ButtonNuovoFill from 'bootstrap-icons/icons/trash-fill.svg';

interface ricettaType { 
    id: string
    titolo: string
    testo: string
    categoria: string
    tags: {tag: string, colore: string}[]
    colore: string
}

interface propsInt {
    userId: string | null
    setRerender: Function
    bootColors: string[]
}

interface idRicetta {
  id: string | undefined
}

const Ricetta: FC<propsInt> = (props: propsInt) => {
    let { id } = useParams<idRicetta>();
    let h = useHistory();
    const [buttonNuovo, setButtonNuovo] = useState(false);
    const [toast, setToast] = useState({show: false, titolo: '', testo: ''});
    const [toastEl, setToastEl] = useState(false);
    const [ricetta, setRicetta] = useState<ricettaType>({id: '', titolo: '', testo: '', categoria: '', tags: [{tag: '', colore: ''}], colore: ''});

    useEffect(() => { 
        setButtonNuovo(false);
        if (props.userId !== null && props.userId !== '') {
            const firebaseRef = store.collection(props.userId);
            firebaseRef.doc(id).get().then((doc: any) => {
                setRicetta({id: doc.id, ...doc.data()});
            }).catch((e) => {
                console.error('ERRORE: ', e);
            });
        }
    }, [id, props.userId]);

    const deleteRicetta = async () => {
        try {
            if (props.userId !== null) {
                var firebaseRef = store.collection(props.userId);
                await firebaseRef.doc(ricetta.id).delete();
                await props.setRerender(true);
                props.setRerender(false);
                h.push('/');                
            }
        } catch (error: any) {
            console.error(error);

            setToast({
                show: true,
                titolo: 'Qualcosa è andato storto...',
                testo: error.toString()
            });

            setTimeout(() => {
                setToast({show: false, titolo: '', testo: ''});
            }, 5000);
        }
    }

    const deleteToast = async () => {
        setToastEl(true);

        // 👇 old-way
        // if (window.confirm("Sei sicuro di voler eliminare la ricetta?") && props.userId !== null) { 
        //     var firebaseRef = store.collection(props.userId);
        //     await firebaseRef.doc(ricetta.id).delete();
                
        //     await props.setRerender(true);
        //     props.setRerender(false);
        //     h.push('/');
        // } else {
        //     if (props.userId === null) {
        //         throw Error('L\'utente si è disconnesso, ricaricare la pagina.');
        //     } 
        // } 
    }

    return (
        <>
            {ricetta.titolo === '' ? <div className="container mt-5 d-flex justify-content-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div> : <div className="container"><h1>{ricetta.titolo} <small className="text-muted">• {ricetta.categoria}</small></h1></div>}

            <div className="button-nuovo">
                <img src={buttonNuovo === false ? ButtonNuovo : ButtonNuovoFill} className="mt-1 cursor-pointer" width="30" height="30" alt="Su" onClick={deleteToast} onMouseEnter={()=>{setButtonNuovo(!buttonNuovo)}} onMouseLeave={()=>{setButtonNuovo(!buttonNuovo)}} />
            </div>

            <div className="container"><div className="container"><hr/></div></div>

            <div className="container">
                {ricetta.tags.map((a) => {
                    var tagColor = 'badge bg-' + a.colore + ' mb-3 ms-2 mt-2';
                    return <span className={tagColor} key={ricetta.tags.indexOf(a)}>{a.tag}</span>;
                })}
            </div>

            <div className="container mt-3 ms-3">
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(ricetta.testo)}}></div> 
            </div>

            <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex: 11}}>
                <div id="liveToast" className={toast.show ? "toast show" : "toast"} role="alert" aria-live="assertive" aria-atomic="true" data-autohide="true">
                    <div className="toast-header">
                        <svg className="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#DC3545"></rect></svg>
                        <strong className="me-auto">{toast.titolo}</strong>
                    </div>
                    <div className="toast-body">
                        {toast.testo}
                    </div>
                </div>
            </div>

            <div className="position-fixed bottom-0 end-0 p-3" style={{zIndex: 11}}>
                <div id="liveToast" className={toastEl ? "toast show" : "toast"} role="alert" aria-live="assertive" aria-atomic="true" data-autohide="true">
                    <div className="toast-header">
                        <svg className="bd-placeholder-img rounded me-2" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="xMidYMid slice" focusable="false"><rect width="100%" height="100%" fill="#DC3545"></rect></svg>
                        <strong className="me-auto">Eliminare la ricetta definitivamente?</strong>
                    </div>
                    <div className="toast-body">
                        <button type="submit" className="btn btn-outline-dark" onClick={deleteRicetta}>
                            Si
                        </button>   
                        <button type="submit" className="btn btn-outline-dark ms-2" onClick={() => {setToastEl(false)}}>
                            No
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ricetta;
