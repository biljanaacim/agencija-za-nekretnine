import {useState, useEffect} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {getDoc, doc} from 'firebase/firestore'
import {getAuth} from 'firebase/auth'
import {db} from '../firebase.config'
import Spinner from '../components/Spinner'
import shareIcon from '../assets/svg/shareIcon.svg'
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Listing() {
const [listing, setListing] = useState(null)
const [loading, setLoading] = useState(true)
const [shareLinkCopied, setShareLinkCopied] = useState(false)

const navigate = useNavigate()
const params = useParams()
const auth = getAuth()

useEffect(()=>{
    const fetchListing = async () => {
        const docRef = doc(db, 'listings', params.listingId)
        const docSnap = await getDoc (docRef)

        if(docSnap.exists()){
            setListing(docSnap.data())
            setLoading(false)
        }
    }

    fetchListing()
}, [navigate, params.listingId])

if(loading){
    return <Spinner />
}

  return (
    <main>
               <Swiper
    modules={[Navigation, Pagination, Scrollbar, A11y]}
    slidesPerView={1}
    pagination={{ clickable: true }}
    navigation
    style={{ height: '300px' }}
>
    {listing.imgUrls.map((url, index) => {
       return (
            <SwiperSlide key={index}>
                <div
                    className='swiperSlideDiv'
                    style={{
                        background: `url(${listing.imgUrls[index]}) center no-repeat`,
                        backgroundSize: 'cover',
                    }}
                ></div>
            </SwiperSlide>
        );
    })}
</Swiper>


      <div className="shareIconDiv" onClick={()=>{
        navigator.clipboard.writeText(window.location.href)
        setShareLinkCopied(true)
        setTimeout(()=>{
            setShareLinkCopied(false)
        }, 2000)
      }}>
        <img src={shareIcon} alt="" />
    </div>  

    {shareLinkCopied && <p className='linkCopied'>Link kopiran</p>}
    
    <div className="listingDetails">
    <p className="listingName">{listing.name} - €{listing.offer
                    ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </p>
                <p className="listingLocation">{listing.location}</p>
                <p className="listingType">
                    Za {listing.type === 'rent' ? 'najam' : ' prodaju'}
                </p>
                {listing.offer && (
                    <p className="discountPrice">
                        €{listing.regularPrice - listing.discountedPrice}
                        sniženje
                    </p>
                )}

      <ul className="listingDetailsList">
        <li>
            {listing.bedrooms > 1 ? `${listing.bedrooms}
            spavaće sobe` : '1 spavaća soba'}
        </li>
        <li>
            {listing.bathrooms > 1 ? `${listing.bathrooms}
            kupatila` : '1 kupatilo'}
        </li>
        <li>{listing.parking && 'Parking mesto'}</li>
        <li>{listing.furnished && 'Namešten'}</li>
        </ul> 

     

        {auth.currentUser?.uid !== listing.userRef && (
            <Link to={`/contact/${listing.userRef}?listingName=${listing.name}`} className='primaryButton'>
                Kontaktiraj stanodavca
            </Link>
        )}             

    </div>
    </main>
  )
}

export default Listing