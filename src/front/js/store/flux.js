import html2canvas from 'html2canvas';
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],

			isLoggedIn: false,

			formInput: {name:"", class:"", race:"", alignment:['',''], spell:"", description:"", damage:"", backstory:"", statToAdd:""},

			formInputItem: {name:"",uses:"", ac:"", attune:false, atribute1:"",atribute2:"",atribute3:"", rarity:"", description:[], damage:[],  backstory:"", statToAdd:""},

			formInputSpell: {name:"",class:"", castingTime:"Instantaneous", range:"", duration:"", rarity:"", components:"", damage:"",higherLvl:"",  backstory:"", statToAdd:"", isVerbal:"", isSomatic:"", isMaterial:""},

			bubbleRange: 2, 
			statBubbleVis: ['visible', 'visible','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden'],
			cardImageFile:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg/220px-Bonnet_macaque_%28Macaca_radiata%29_Photograph_By_Shantanu_Kuveskar.jpg",

		},
		actions: {
			isTokenExpired: (token) => {
                if (!token) return true;
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                return decodedToken.exp < currentTime;
			},

			setIsLoggedIn: (status) => {
				console.log("setIsLoggedIn action triggered with status:", status);
				setStore({ isLoggedIn: status });
			},

			checkTokenAndLogout: (navigate) => {
				const token = localStorage.getItem('token');
				
				if (!token) {
				  actions.setIsLoggedIn(false);  // If no token, log out
				  localStorage.removeItem('token');
				  localStorage.setItem('userLoggedIn', 'false');
				  navigate('/login');  // Redirect to login page
				  return;
				}
			  
				try {
				  const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
				  const tokenExpiry = decodedToken.exp; // Decode token to get expiry time
				  const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
				
				  // Check if the token has expired
				  if (currentTime >= tokenExpiry) {
					actions.setIsLoggedIn(false);  // Log out if expired
					localStorage.removeItem('token');
					localStorage.setItem('userLoggedIn', 'false');
					navigate('/login');  // Redirect to login page
				  }
				} catch (error) {
				  console.error("Error decoding token: ", error);
				  actions.setIsLoggedIn(false);  // If decoding fails, log out
				  localStorage.removeItem('token');
				  localStorage.setItem('userLoggedIn', 'false');
				  navigate('/login');  // Redirect to login page
				}
			  },

			saveAs : (imageUri,fileName) => {
				if(fileName!=''){
				  const link = document.createElement('a');
				  if (typeof link.download === 'string') {
					  link.href = imageUri;
					  link.download = fileName +'.jpeg';
					  document.body.appendChild(link);
					  link.click();
					  document.body.removeChild(link);
				  } else {
					  window.open(uri);
				  }
				}
				else{
				  alert("Please enter a name for the card")
				  return
				}
			},
			handleExportAsURI : async (element) => {
				try {
				  if (!element) return;
			
				  const canvas = await html2canvas(element, {
					  scale: window.devicePixelRatio || 1,
					  scrollX: -window.scrollX,
					  scrollY: -window.scrollY,
					  useCORS: true,
					  backgroundColor: 'transparent',
				  });
				  const uri = canvas.toDataURL("image/jpeg");
				  // console.log(canvas.width)
				  // console.log(canvas.height)
				  console.log(uri);
				  return(uri);
				} catch (error) {
				  console.error("Error generating URI:", error);
				}
			  },
			  insertImage: async (fileName,imageUri,tagList)=>{
				const date=new Date()
				if(fileName==''){
				  alert("Please enter a name for the card")
				  return
				}
				console.log("before fetch")
				const Url=await fetch(localStorage.getItem('backendUrl')+'api/card',{
				  method:'POST',
				  body:JSON.stringify({
					'filename':fileName,
					'uri':imageUri,
					'tags':tagList,
					'userId':localStorage.getItem('userId'),
					'uploadedDate': date
				  }),
				  headers: {
					'Content-Type':'application/json', 
					'Authorization':'Bearer '+ localStorage.getItem('token')
				  }
				}).then((response)=>{
				  console.log("after fetch")
				  return response.json()
				}).then((jsonRes)=>{
				  fetch(localStorage.getItem('backendUrl')+'/api/cardid',{
					method:'POST',
					body:JSON.stringify({
						imageId:jsonRes['id']
					}),
					headers:{'Content-Type' : 'application/json'}
				  }).then((response)=>{
					return response
				  }).then((respJson)=>{
					return(JSON.stringify(respJson['url']))
				  })
				})
				return Url;
			  },
			  getImageURLs:()=>{
				fetch(localStorage.getItem('backendUrl')+'api/cards',{
				method:'GET',
				headers: {'Content-Type':'application/json', 'Authorization':'Bearer '+ localStorage.getItem('token')}
				}).then((response)=>{
				console.log(response)
				return response.json()
				}).then((jsonRes)=>{
				console.log(jsonRes)
				})
			  },
			setFormInput: (newObj) => {
				setStore({ formInput: newObj });
			},

			setFormInputItem: (newObj) => {
				setStore({ formInputItem: newObj });
			},

			setFormInputSpell: (newObj) => {
				setStore({ formInputSpell: newObj });
			},
			setCardImageFile:(newObj) =>{
				setStore({ cardImageFile: newObj });
			},

			setstatBubbleVis: (ind) => {
				const store = getStore();
				setStore({ bubbleRange: parseInt(ind) });
				if(store.bubbleRange>=11){setStore({ statBubbleVis: ['visible','visible', 'visible','visible', 'visible','visible','visible','visible','visible','visible','visible'] });
					}else if(store.bubbleRange>=10){setStore({ statBubbleVis: ['visible', 'visible','visible', 'visible','visible','visible','visible','visible','visible','visible','hidden'] });
						}else if(store.bubbleRange>=9){setStore({ statBubbleVis: ['visible','visible', 'visible','visible','visible','visible','visible','visible','visible','hidden','hidden'] });
							}else if(store.bubbleRange>=8){setStore({ statBubbleVis: ['visible', 'visible','visible','visible','visible','visible','visible','visible','hidden','hidden','hidden'] });
								}else if(store.bubbleRange>=7){setStore({ statBubbleVis: ['visible', 'visible','visible','visible','visible','visible','visible','hidden','hidden','hidden','hidden'] });
									}else if(store.bubbleRange>=6){setStore({ statBubbleVis: ['visible', 'visible','visible','visible','visible','visible','hidden','hidden','hidden','hidden','hidden'] });
										}else if(store.bubbleRange>=5){setStore({ statBubbleVis: ['visible', 'visible','visible','visible','visible','hidden','hidden','hidden','hidden','hidden','hidden'] });
											}else if(store.bubbleRange>=4){setStore({ statBubbleVis: ['visible', 'visible','visible','visible','hidden','hidden','hidden','hidden','hidden','hidden','hidden'] });
												}else if(store.bubbleRange>=3){setStore({ statBubbleVis: ['visible', 'visible','visible','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden'] });
													}else if(store.bubbleRange>=2){setStore({ statBubbleVis: ['visible', 'visible','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden'] });
														}else if(store.bubbleRange>=1){setStore({ statBubbleVis: ['visible', 'hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden'] });
															}else {setStore({ statBubbleVis: ['hidden', 'hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden','hidden'] });}
					},

			

			
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}


		}
	};
};

export default getState;
