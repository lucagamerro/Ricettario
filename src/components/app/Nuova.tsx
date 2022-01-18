import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import { store } from '../../database/firebase';
import DOMPurify from 'dompurify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// interface ricettaType { 
//   id: string
//   titolo: string
//   testo: string
//   tags: {tag: string, colore: string}[]
//   colore: string
// }

interface propsInt {
    userId: string | null
    setRerender: Function
    bootColors: string[]
}
  
const Nuovo = (props: propsInt) => {
    var h = useHistory();
    const [toast, setToast] = useState({show: false, titolo: '', testo: ''});
    const [inputTags, setInputTags] = useState('');
    const [ricetta, setRicetta] = useState({titolo: '', categoria: '0', testo: '', tags: [{tag: '', colore: ''}]});

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
        //   ['image']  
        ],
    };

    const removeTags = (index: number) => {
        var tmpTags = [...ricetta.tags];
        if (index !== -1) {
          tmpTags.splice(index, 1);
         setRicetta({titolo: ricetta.titolo, categoria: ricetta.categoria, testo: ricetta.testo, tags: tmpTags});
        }
    }

    const handleTags = (e: any) => {
        setInputTags(e.target.value);

        if (inputTags.charAt(inputTags.length - 1) === ';') {
            var randomNum = Math.floor(Math.random() * 11);
            setRicetta({titolo: ricetta.titolo, categoria: ricetta.categoria, testo: ricetta.testo, tags: ricetta.tags.concat({tag: inputTags.slice(0,-1).toLowerCase(), colore: props.bootColors[randomNum]})});

            setInputTags('');
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault(); 

        if (ricetta.tags.length !== 1) {
            ricetta.tags.shift();
        }

        try {
            if (ricetta.titolo !== '' && ricetta.testo !== '' && ricetta.categoria !== '0') {
                if (props.userId !== null) {
                    var randomNum = Math.floor(Math.random() * 11);
                    
                    await store.collection(props.userId).add({
                        colore: props.bootColors[randomNum],
                        tags: ricetta.tags,
                        testo: DOMPurify.sanitize(ricetta.testo),
                        titolo: ricetta.titolo,
                        categoria: ricetta.categoria
                    });

                    await props.setRerender(true);
                    props.setRerender(false);
                    
                    h.push('/');
                } else {
                    throw Error('L\'utente si è disconnesso, ricaricare la pagina.');
                }                
            } else {
                throw Error('Compila tutti i campi per continuare.');
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

    return (
        <>
            <form className="container input-group ms-3" onSubmit={(e) => {handleSubmit(e)}} autoComplete="false">

                <div className="mt-3" style={{width: '1000px'}}>
                    <input type="text" value={ricetta.titolo} onChange={(e) => {setRicetta({titolo: (e.target.value.length === 0 ? '' : (e.target.value.length === 1 ? e.target.value[0].toUpperCase() : e.target.value[0].toUpperCase()+e.target.value.substring(1))), categoria: ricetta.categoria, testo: ricetta.testo, tags: ricetta.tags})}} className="form-control input-titolo display-4" placeholder="Titolo" aria-label="Username" spellCheck="false" />
                </div>

                <div className="container"><hr/></div>

                <div>
                    {ricetta.tags.length === 1 ? <span className="text-muted">Qui compariranno i tags... </span> : <span className="text-muted">Tags: </span>}
                    {ricetta.tags.map((a) => {
                        var tagColor = "badge bg-" + a.colore + " mb-3 ms-2 mt-2 cursor-trash";
                        return <span className={tagColor} key={ricetta.tags.indexOf(a)} onClick={() => {removeTags(ricetta.tags.indexOf(a))}}>{a.tag}</span>
                    })}
                </div>

                <div className="input-group">
                    <input type="text" className="form-control input-tags" placeholder="Inserisci i tags separati da un punto e virgola" aria-label="Tags" value={inputTags} onChange={(e) => {handleTags(e)}} />
                </div>

                <div className="input-group mt-3">
                    <label className="input-group-text text-muted" htmlFor="inputGroupSelect01">Categoria</label>
                    <select className="form-select"value={ricetta.categoria} onChange={(e) => setRicetta({titolo: ricetta.titolo, categoria: e.target.value, testo: ricetta.testo, tags: ricetta.tags})}>
                        <option value="0" className="text-muted">Seleziona...</option>
                        <option value="Antipasto">Antipasto</option>
                        <option value="Primo">Primo</option>
                        <option value="Secondo">Secondo</option>
                        <option value="Contorno">Contorno</option>
                        <option value="Dolce">Dolce</option>
                    </select>
                </div>

                <div className="input-testo mt-3">
                    <ReactQuill value={ricetta.testo} modules={modules} onChange={(e) => {setRicetta({titolo: ricetta.titolo, categoria: ricetta.categoria, testo: e, tags: ricetta.tags})}} style={{height: '15rem'}} />
                </div>

                <div className="mt-3">
                    <button type="submit" className="btn btn-outline-dark">Salva</button>
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

            </form>
        </>
    );
}

export default Nuovo;
