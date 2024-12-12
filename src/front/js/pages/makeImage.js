import React, { useRef, useState, useContext, useEffect } from 'react';
import { Context } from "../store/appContext";
import cardBG from "../../img/blank_bg.png";
import cardFG from "../../img/Cardbg2.png";
import '../../styles/makeImage.css'
import { Link, useParams } from "react-router-dom";
import  UploadImage  from "../component/avatarUpload";



const StatForm = () =>{
   const { store, actions } = useContext(Context);
  let {formInput} = store;
  const [url, setURL] = useState("https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg/220px-Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg");
  useEffect(()=> actions.setCardImageFile(url),[url]);
  return(
  <div className='form'>

    <div className="input-group">
      <span className="input-group-text formTitle">Name</span>
      <input type="text" aria-label="classInput" class="form-control" onChange={(e)=>actions.setFormInput(  {...formInput, name:e.target.value})}/>
    </div>

    <div className="input-group">
      <span className="input-group-text formTitle">Class</span>
      <input type="text" aria-label="classInput" className="form-control" onChange={(e)=>actions.setFormInput(  {...formInput, class: "Class: "+e.target.value})}/>
    </div>

    <div className="input-group">
      <span className="input-group-text formTitle">Race</span>
      <input type="text" aria-label="raceInput" className="form-control" onChange={(e)=>actions.setFormInput(  {...formInput, race: "Race: "+e.target.value})}/>
    </div>

    <div className="input-group mb-3">
      <label className="input-group-text formTitle" for="inputGroupSelect01">Alignment</label>
      <select className="form-select formTitle" id="inputGroupSelect01" onChange={(e)=>actions.setFormInput(  {...formInput, alignment: [e.target.value, formInput.alignment[1]]})}>
        <option value=" ">Pick Alignment</option>
        <option value="chaotic ">Chaotic</option>
        <option value="neutral ">Neutral</option>
        <option value="lawful ">Lawful</option>
      </select>

      <select className="form-select formTitle" id="inputGroupSelect01" onChange={(e)=>actions.setFormInput(  {...formInput, alignment: [formInput.alignment[0], e.target.value ]})}>
        <option value=" ">Pick Alignment</option>
        <option value="good">Good</option>
        <option value="neutral">Neutral</option>
        <option value="evil">Evil</option>
      </select>
    </div>

    <label for="bubbleRange" className="form-label formTitle">How many stat bubbles do you need? {store.bubbleRange}</label>
      <input type="range" className="form-range" min="0" max="11" id="bubbleRange" defaultValue={store.bubbleRange} onChange={(e)=>actions.setstatBubbleVis([e.target.value])}>
    </input>

    <div className= "input-group statToAdd d-flex">
      
        <div class="mb-3">
          <label for="itemNameInput" class="form-label"></label>
          <div className="btn-group" role="group" aria-label="Basic example" >
            <button type="button" className="btn btn-primary mx-1 formTitle" onClick={()=>actions.setFormInput(  {...formInput, damage: formInput.statToAdd})}>Damage</button>
            <button type="button" className="btn btn-primary mx-1 formTitle" onClick={()=>actions.setFormInput(  {...formInput, spell: formInput.statToAdd})}>Spell/Effect</button>
            <button type="button" className="btn btn-primary mx-1 formTitle" onClick={()=>actions.setFormInput(  {...formInput, description: formInput.statToAdd})}>Description</button>
          </div>
          <textarea  type="text" className="form-control formTitle" id="itemDescriptionInput" placeholder="Description" rows="3"
            onChange={(e)=>actions.setFormInput({...formInput, statToAdd: [e.target.value]})}>
          </textarea>
        </div>



    </div>
    <textarea  type="text" className="form-control formTitle" id="itemDescriptionInput" placeholder="Backstory" rows="3" 
            onChange={(e)=>actions.setFormInput({...formInput, backstory: [e.target.value]})}>
    </textarea>

    <div className="input-group mb-3 formTitle">
      <UploadImage setURL={setURL}/>
    
    </div>

  </div>
  
)};


const ComponentToPrint = React.forwardRef((props, ref) => {
  const { store, actions } = useContext(Context);
  let {formInput} = store;
  

  return(
	<div ref={ref} className='position-relative' style={{
        width:500,
        height: 700,
        overflow: 'hidden',
        boxSizing: 'border-box',
        clipPath: 'inset(0 0 0 0)'
      }}>
    <img className='cardFrameBackground'src={cardBG}></img>
    <img className='cardImage'  src={store.cardImageFile}></img>
    <img className='cardFrameForeground'src={cardFG}></img>
    
	  <div className='mainCardBody'>
      <div className='statContainer container bubblesContainer '>
          <div className='row bubblesRow mb-3 gx-0'>
            <div className='col align-self-end'>	
              <h4  className='stat' id='stat1' style={{visibility:  store.statBubbleVis[0]}}></h4>
            </div>
            	
            <div className='col align-self-start colBlend' >
              <h4  className='stat' id='stat2' style={{visibility:  store.statBubbleVis[1]}}></h4>
            </div>

            <div className='col align-self-end colBlend'>	
              <h4  className='stat' id='stat3' style={{visibility:  store.statBubbleVis[2]}}></h4>
            </div>
            	
            <div className='col align-self-start colBlend'>
              <h4  className='stat' id='stat4'style={{visibility:  store.statBubbleVis[3]}}></h4>
            </div>
            
            <div className='col align-self-end colBlend'>	
              <h4  className='stat' id='stat5' style={{visibility:  store.statBubbleVis[4]}}></h4>
            </div>
            	
            <div className='col align-self-start colBlend'>
              <h4  className='stat' id='stat6' style={{visibility:  store.statBubbleVis[5]}}></h4>
            </div>

            
          </div>
          <div className='row bubblesRow2 gx-0 mb-3'>
            <div className='col align-self-start'>	
              <h4  className='stat' id='stat7' style={{visibility:  store.statBubbleVis[6]}}></h4>
            </div>
            	
            <div className='col align-self-end colBlend'>
              <h4  className='stat' id='stat8' style={{visibility:  store.statBubbleVis[7]}}></h4>
            </div>

            <div className='col align-self-start colBlend'>
              <h4  className='stat' id='stat9' style={{visibility:  store.statBubbleVis[8]}}></h4>
            </div>
          
            <div className='col align-self-end colBlend'>
                <h4  className='stat' id='stat10' style={{visibility:  store.statBubbleVis[9]}}></h4>
            </div>

            <div className='col align-self-start colBlend'>
                <h4  className='stat' id='stat11' style={{visibility:  store.statBubbleVis[10]}}></h4>
            </div>
            
            
          </div>
        </div>


			<div className='rightStatInfo mt-1 '>
        <h3 id='cardTitle' className='cardText'>{ store.formInput.name}</h3>
				<p id='className' className='titled cardText'>{formInput.class}</p>
				<p id='raceName' className='titled cardText'>{formInput.race}</p>
        <p id='alignmentName' className='titled cardText'>{formInput.alignment}</p>
				
        <p className='text-decoration-underline titled'>Damage</p>
        <p id='stat1' className='statDetails'>{formInput.damage}</p>
				
        <p className='text-decoration-underline titled'>Spells</p> 
        <p id='stat1' className='statDetails'>{formInput.spell}</p>

				<p className='text-decoration-underline titled'>Description</p>
				<p id='stat1' className='statDetails'>{formInput.description}</p>

			</div>
		</div>

    
      <div className='originStory'>
        <p className='titled text-center'>Backstory/Origin</p>
        <p className='statDetails text-center px-3'> {store.formInput.backstory}</p>
          
      </div>


    
  </div>
)});







export const CharacterImageCreator = () => {
  const componentRef = useRef();
  const [imageUri, setImageUri] = useState("");
  const [fileName,setFileName]=useState('')
  const [tagList,setTagList]=useState(['Paul','Mike'])
  const { store, actions } = useContext(Context);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(()=>{
    if(imageUri != ""){
      console.log(imageUri)
      getTags()
      async function pushImage() {
        const fileUrl=await actions.insertImage(fileName,imageUri,tagList);
        setImageUrl(fileUrl)
      }
      pushImage()
    }
  },[imageUri])

  useEffect(()=>{
    if(imageUrl != ""){
      actions.saveAs(imageUri,fileName);
    }
  },[imageUrl])

  const getTags=async()=>{
    setTagList([...tagList,store.formInput.class.slice(7,),store.formInput.race.slice(6),store.formInput,store.formInput.alignment[0]+' '+store.formInput.alignment[1]])
  }
  const handleExport=async()=>{
    await getTags()
    console.log(tagList)
    const element = componentRef.current;
    const uri=await actions.handleExportAsURI(element)
    console.log(uri)
    setImageUri(uri)
  }
  return (
    
    <div> 
      <div className='d-flex mx-5 flex-row justify-content-center my-3'>
        <div className='d-flex mx-5 '>
            <div ref={componentRef}>
                <ComponentToPrint/>
            </div>
            {/* <img src={imageUri} alt="" /> */}
        </div>
        <div className='statForm'>
          <StatForm/>
          
        </div>
      </div>
      <label>filename</label>
      <input value={fileName} onChange={(e)=>{setFileName(e.target.value)}}></input>
      <button onClick={handleExport}>Export as URI</button>
      <button onClick={actions.getImageURLs}>Get all Cards</button>
    </div>
  );
};
  