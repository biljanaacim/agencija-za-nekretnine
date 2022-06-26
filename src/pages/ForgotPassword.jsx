import {useState} from 'react'
import {Link} from 'react-router-dom'
import {getAuth, sendPasswordResetEmail} from 'firebase/auth'
import {toast} from 'react-toastify'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import { async } from '@firebase/util'

function ForgotPassword() {
const [email, setEmail] = useState('')

const onChange = e => setEmail(e.target.value)
const onSubmit = async (e)=>{
  e.preventDefault()
  try {
    const auth = getAuth()
    await  sendPasswordResetEmail(auth, email)
    toast.success('Email je poslat')
  } catch (error) {
    toast.error ('Nije moguće poslati email')
  }
}

  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">Zaboravili ste lozinku</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input type='email' className="emailInput"
          placeholder='Email' 
          id='email'
          value={email}
          onChange={onChange}/>
          <Link className='forgotPasswordLink' to='/sign-in'>
            Prijavi se
          </Link>

          <div className="signInBar">
            <div className="signInText">Link za oporavak</div>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgotPassword
