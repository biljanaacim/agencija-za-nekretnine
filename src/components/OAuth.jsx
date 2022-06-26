import {useLocation, useNavigate} from 'react-router-dom'
import {getAuth, signInwithPopup, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import {doc, setDoc, getDoc, serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'
import googleIcon from '../assets/svg/googleIcon.svg'
import { async } from '@firebase/util'

function OAuth() {
const navigate = useNavigate()
const location = useLocation()

const onGoogleClick = async () => {
    try {
        const auth = getAuth()
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        const user = result.user
        //check for user
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        //if user doesn't exist, create user
        if(!docSnap.exists()){
            await setDoc(doc(db, 'users', user.uid), {
                name: user.displayName,
                email: user.email,
                timestamp: serverTimestamp(),
            })

        }
        navigate('/')
    } catch (error) {
        toast.error('Ne može se povezati sa Google-om')
    }
}


  return (
    <div className='socialLogin'>
        <p>Prijavi se putem Google-a</p>
        <button className='socialIconDiv' onClick={onGoogleClick}>
            <img className='socialIconImg' src={googleIcon} alt='google' />
        </button>
    </div>
  )
}

export default OAuth