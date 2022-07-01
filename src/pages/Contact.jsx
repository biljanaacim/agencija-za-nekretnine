import {useState, useEffect} from 'react'
import {useParams, useSearchParams} from 'react-router-dom'
import {doc, getDoc} from 'firebase/firestore'
import {db} from '../firebase.config'
import {toast} from 'react-toastify'

function Contact() {
    const [message, setMessage] = useState('')
    const [landlord, setLandlord] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const params = useParams()

    useEffect(()=>{
        const getLandlord = async () =>{
            const docRef = doc(db, 'users', params.landlordId)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()) {
                setLandlord(docSnap.data())
            }else{
                toast.error('Nema podataka o stanodavcu')
            }

        }
        getLandlord()

    }, [params.landlord])

    const onChange = e => setMessage(e.target.value)

  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">
            Kontakt stanodavca
        </p>
      </header>
      {landlord !== null && (
        <main>
         <div className="contactLandlord">
            <p className="landlordName">
                Kontakt <br/>
                {landlord?.name} 
        </p>
        
        <form className="messageForm">
        <div className="messageDiv">
            <label htmlFor="message" className="messageLabel">
                <br />
                Poruka
            </label>
            <textarea name="message" id="message" className='textarea'
            value={message} onChange={onChange}></textarea>
        </div>

        <a href={`mailto:${landlord.email}?Subject=${searchParams.get('listingName')}&body=${message}`}>
        <button type='button' className='primaryButton'>Pošalji poruku</button>

        </a>

        </form>
        </div>   
        </main>
      )}
    </div>
  )
}

export default Contact
