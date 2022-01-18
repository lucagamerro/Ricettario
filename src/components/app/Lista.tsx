import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from "react-router-dom";
import DOMPurify from 'dompurify';
import ButtonNuovo from 'bootstrap-icons/icons/plus-circle.svg';
import ButtonNuovoFill from 'bootstrap-icons/icons/plus-circle-fill.svg';

interface ricettaType { 
  id: string
  titolo: string
  testo: string
  categoria: string
  tags: {tag: string, colore: string}[]
  colore: string
}

interface propsInt {
  initialRicette: any //! fix me please, non devi usare any 💢
  bootColors: string[]
}
  
const Lista = (props: propsInt) => {
  const [ricette, setRicette] = useState([{id: '', titolo: '', testo: '', categoria: '', tags: [{tag: '', colore: ''}], colore: 'primary'}]);
  const [buttonNuovo, setButtonNuovo] = useState(false);
  var alfabeto = useMemo(() => {return {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, z: 0}}, []);
  let h = useHistory();
  let itemRefs: any = [];

  function compare(a: ricettaType, b: ricettaType) {
    if ( a.titolo < b.titolo ){
      return -1;
    }
    if ( a.titolo > b.titolo ){
      return 1;
    }
    return 0;
  }
  
  useEffect(() => {
    setRicette([...props.initialRicette.current].sort(compare));
    setButtonNuovo(false);
    for (var i=0; i<ricette.length; i++) {
      if ((alfabeto.a === 0) && ricette[i].titolo.toLowerCase().startsWith('a')) {
        alfabeto.a = i;
      }
      if ((alfabeto.b === 0) && ricette[i].titolo.toLowerCase().startsWith('b')) {
        alfabeto.b = i;
      }
      if ((alfabeto.c === 0) && ricette[i].titolo.toLowerCase().startsWith('c')) {
        alfabeto.c = i;
      }
      if ((alfabeto.d === 0) && ricette[i].titolo.toLowerCase().startsWith('d')) {
        alfabeto.d = i;
      }
      if ((alfabeto.e === 0) && ricette[i].titolo.toLowerCase().startsWith('e')) {
        alfabeto.e = i;
      }
      if ((alfabeto.f === 0) && ricette[i].titolo.toLowerCase().startsWith('f')) {
        alfabeto.f = i;
      }
      if ((alfabeto.g === 0) && ricette[i].titolo.toLowerCase().startsWith('g')) {
        alfabeto.g = i;
      }
      if ((alfabeto.h === 0) && ricette[i].titolo.toLowerCase().startsWith('h')) {
        alfabeto.h = i;
      }
      if ((alfabeto.i === 0) && ricette[i].titolo.toLowerCase().startsWith('i')) {
        alfabeto.i = i;
      }
      if ((alfabeto.l === 0) && ricette[i].titolo.toLowerCase().startsWith('l')) {
        alfabeto.l = i;
      }
      if ((alfabeto.m === 0) && ricette[i].titolo.toLowerCase().startsWith('m')) {
        alfabeto.m = i;
      }
      if ((alfabeto.n === 0) && ricette[i].titolo.toLowerCase().startsWith('n')) {
        alfabeto.n = i;
      }
      if ((alfabeto.o === 0) && ricette[i].titolo.toLowerCase().startsWith('o')) {
        alfabeto.o = i;
      }
      if ((alfabeto.p === 0) && ricette[i].titolo.toLowerCase().startsWith('p')) {
        alfabeto.p = i;
      }
      if ((alfabeto.q === 0) && ricette[i].titolo.toLowerCase().startsWith('q')) {
        alfabeto.q = i;
      }
      if ((alfabeto.r === 0) && ricette[i].titolo.toLowerCase().startsWith('r')) {
        alfabeto.r = i;
      }
      if ((alfabeto.s === 0) && ricette[i].titolo.toLowerCase().startsWith('s')) {
        alfabeto.s = i;
      }
      if ((alfabeto.t === 0) && ricette[i].titolo.toLowerCase().startsWith('t')) {
        alfabeto.t = i;
      }
      if ((alfabeto.u === 0) && ricette[i].titolo.toLowerCase().startsWith('u')) {
        alfabeto.u = i;
      }
      if ((alfabeto.v === 0) && ricette[i].titolo.toLowerCase().startsWith('v')) {
        alfabeto.v = i;
      }
      if ((alfabeto.z === 0) && ricette[i].titolo.toLowerCase().startsWith('z')) {
        alfabeto.z = i;
      }
    }
  }, [props.initialRicette, ricette, alfabeto]);

  function scrollTo(id: number) {
    itemRefs[id].scrollIntoView();
  }

  const mappaRicette = ricette.map((row, index) => { 
    var i: ricettaType = row;
    var ind: number = index;
    var link: string = '/ricetta/' + i.id;
    var cardColor = "card border-" + i.colore + " mb-3 ms-3 mt-3";
    var testo = i.testo?.substring(0, 90).replace(/\s+$/, '') + '... ';

    var categoriaColor = "";
    if (i.categoria === 'Antipasto') {categoriaColor = "badge bg-info mb-1 ms-2 mt-2"}
    else if (i.categoria === 'Primo') {categoriaColor = "badge bg-success mb-1 ms-2 mt-2"}
    else if (i.categoria === 'Secondo') {categoriaColor = "badge bg-warning mb-1 ms-2 mt-2"}
    else if (i.categoria === 'Contorno') {categoriaColor = "badge bg-danger mb-1 ms-2 mt-2"}
    else if (i.categoria === 'Dolce') {categoriaColor = "badge bg-dark mb-1 ms-2 mt-2"} 
    else {categoriaColor = "badge bg-info mb-1 ms-2 mt-2"}


    return (
      <div className={cardColor} style={{maxWidth: '18rem'}} onClick={() => {h.push(link);}} key={ind} ref={el => (itemRefs[ind] = el)}>
        <div className="card-body">
          <h4 className="card-title">{i.titolo}</h4>
          <p className="card-text" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(testo)}}></p>
          <span className={categoriaColor}>{i.categoria}</span>
        </div>
      </div>
    );
  });


  return (
    <>
      <div className="container-fluid ms-2 mt-4 mb-3 alfabeto">
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.a);}}>A</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.b);}}>B</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.c);}}>C</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.d);}}>D</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.e);}}>E</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.f);}}>F</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.g);}}>G</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.h);}}>H</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.i);}}>I</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.l);}}>L</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.m);}}>M</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.n);}}>N</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.o);}}>O</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.p);}}>P</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.q);}}>Q</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.r);}}>R</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.s);}}>S</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.t);}}>T</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.u);}}>U</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.v);}}>V</span>
          <span className="ms-3 mt-3" onClick={() => {scrollTo(alfabeto.z);}}>Z</span>
      </div>
         
      <div className="button-nuovo">
        <img src={buttonNuovo === false ? ButtonNuovo : ButtonNuovoFill} className="mt-1 cursor-pointer" width="30" height="30" alt="Su" onClick={() => {h.push('/nuova');}} onMouseEnter={()=>{setButtonNuovo(!buttonNuovo)}} onMouseLeave={()=>{setButtonNuovo(!buttonNuovo)}} />
      </div>
      {/* <div className="container"><div className="container"><hr/></div></div> */}
        
      <div className="d-flex flex-wrap lista-ricette justify-content-center"> 
         
        {mappaRicette.length !== 0 ? mappaRicette : <h4 className="text-muted mt-4">Ancora nessuna ricetta.</h4>} 
        
      </div>
    </>
  );
}

export default Lista;
