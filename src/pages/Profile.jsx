import {useState} from 'react'
import {useNavigate } from 'react-router-dom' 
import {getAuth, updateProfile} from 'firebase/auth'
import {updateDoc, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'

function Profile() {

  const auth=getAuth()
  const [changeDetails, setChangeDetails] = useState(false)
  const navigate = useNavigate()

const [formData, setFormData] = useState({
  name: auth.currentUser.displayName,
  email: auth.currentUser.email,
})

const {name, email} = formData


const onLogout = () =>{
  auth.signOut()
  navigate('/')
}

const onSubmit = async () => {
  try {
    if(auth.currentUser.displayName !== name){
      //Update display name in fb
      await updateProfile(auth.currentUser, {
        displayName:name
      })
      //Update in firestore
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userRef, {
        name,
      })
    }
  } catch (error) {
    console.log(error);
    toast.error('Nije moguće ažurirati detalje profila')
  }
}

const onChange = (e) =>{
  setFormData(prevState => ({
    ...prevState,
    [e.target.id]: e.target.value,
  }))
}

  return <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader">Moj profil</p>
      <button type="button" className="logOut" onClick={onLogout}>
        Odjavi se</button>
    </header>
<main>
  <div className="profileDetailsHeader">
    <p className="profileDetailsText">Lični detalji</p>
    <p className="changePersonalDetails" onClick={()=> {
    changeDetails && onSubmit()
    setChangeDetails(prevState=> !prevState)
    }}>
      {changeDetails ? 'gotovo':'promeni'}
    </p>
  </div>
  <div className="profileCard">
    <form>
      <input type="text" id='name' className=
      {changeDetails ? 'profileName' : 'profileNameActive'}
      disabled={!changeDetails}
      value={name}
      onChange={onChange}
      />
       <input type="text" id='email' className=
      {changeDetails ? 'profileEmail' : 'profileEmailActive'}
      disabled={!changeDetails}
      value={email}
      onChange={onChange}
      />
    </form>
  </div>
</main>

  </div> 
}

export default Profile
