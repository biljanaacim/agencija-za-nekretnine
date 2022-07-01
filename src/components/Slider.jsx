import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {collection, getDocs, query, orderBy, limit, doc} from 'firebase/firestore'
import {db} from '../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import Spinner from './Spinner';

function Slider() {
const [loading, setLoading] =useState(true)
const [listings, setListings] = useState(null)

const navigate = useNavigate()

useEffect(()=>{
const fetchListings = async() =>{

    
 const listingsRef = collection(db, 'listings')
 const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
 const querySnap = await getDocs(q)

 let listings = []

 querySnap.forEach((doc)=>{
    return listings.push({
        id: doc.id,
        data: doc.data()
    })
 })

setListings(listings)
setLoading(false)
}

fetchListings()

}, [])

if(loading){
    return <Spinner />
}
if(listings.length === 0){
   return <></>
}

  return listings && (
    <>
    <p className="exploreHeading">Preporučeno</p>

    <Swiper className='swiper-container' slidesPerView={1} pagination={{clickable: true}}>
     {listings.map(({data, id})=>(
      <SwiperSlide key={id} onClick={()=> navigate(`/category/${data.type}/${id}`)}>
       <div style={{background: `url(${data.imgUrls[0]}) 
       center no-repeat`,
       backgroundSize: 'cover'
    }} 
    className="swiperSlideDiv"></div>
        
         <p className="swiperSlideText">{data.name}</p>
         <p className="swiperSlidePrice">
            € {data.discountedPrice ?? data.regularPrice}{' '}
            {data.type === 'rent' && ' / mesečno'}
         </p>

      </SwiperSlide>

     )

     )}
    </Swiper>
    
    </>
  )
}

export default Slider