import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {ReactComponent as ArrowRightIcon} from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import {toast} from 'react-toastify'
import OAuth from '../components/OAuth'


function Signin() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email:'',
        password:''
    })
    const {email, password} =formData

    const navigate =useNavigate()

    const onChange = (e) => {
        setFormData((prevState)=>({
            ...prevState,
            [e.target.id]: e.target.value,

        }))
    }

    const onSubmit = async (e) =>{
        e.preventDefault()

        try {
            const auth = getAuth()

            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            if(userCredential.user){
                navigate('/')
            }
            
        } catch (error) {
            toast.error('Greška')
        }


    }

  return (
    <>
    <div className='pageContainer'>
        <header>
            <p className='pageHeader'>
                Dobrodošli nazad!
            </p>
        </header>
        <main>
            <form onSubmit={onSubmit}>
                <input type="email" className='emailInput'
                 placeholder='Email' id='email' value={email} onChange={onChange}/>
            <div className='passwordInputDiv'>
                <input type={showPassword ? 'text' : 'password'}
                className='passwordInput' placeholder='Lozinka' id='password'
                value={password} onChange={onChange} />

                <img src={visibilityIcon} alt="show password" className='showPassword'
                onClick={()=> setShowPassword((prevState)=>!prevState)} />
            </div>
            <Link to='/forgot-password' className='forgotPasswordLink'>
                Zaboravili ste lozinku?
            </Link>
            <div className='signInBar'>
            <p className='signInText'> Prijavi se</p>
            <button className='signInButton'>
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
                 </button>
            </div>
            </form>

            <OAuth />

            <Link to='/sign-up' className='registerLink'>
                Registruj se
            </Link>
        </main>
    </div>
    </>
  )
}

export default Signin