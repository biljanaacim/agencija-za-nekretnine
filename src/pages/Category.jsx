import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {collection, getDocs, query, where, orderBy, limit,startAfter} from 'firebase/firestore' 
import {db} from '../firebase.config'
import {toast} from 'react-toastify' 
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'


const Category = () => {
    const [listings, setListings] = useState()
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const params = useParams()

    useEffect(()=>{
        const fetchListings  = async () => {
            try {
                //get reference
                const listingsRef = collection(db, 'listings')


                // create query
                const q = query(listingsRef, where('type', '==', params.categoryName),
                orderBy('timestamp', 'desc'),
                limit(10))
              

                //execute query
                const querySnap = await getDocs(q)

                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

                const listings = []
                
                querySnap.forEach((doc)=>{
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                setListings(listings)
                setLoading(false)

            } catch (error) {
                toast.error('Ne mogu se preuzeti liste')
            }
        }
        fetchListings()
    }, [params.categoryName])

//pagination - load more

    const onFetchMoreListings  = async () => {
        try {
            //get reference
            const listingsRef = collection(db, 'listings')


            // create query
            const q = query(listingsRef, where('type', '==', params.categoryName),
            orderBy('timestamp', 'desc'),
            startAfter(lastFetchedListing),
            limit(10))
          

            //execute query
            const querySnap = await getDocs(q)

            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)

            const listings = []
            
            querySnap.forEach((doc)=>{
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setListings((prevState)=>[...prevState, ...listings])
            setLoading(false)

        } catch (error) {
            toast.error('Ne mogu se preuzeti liste')
        }
    }

  return (
    <div className='category'>
<header>
    <p className="pageHeader">
        {params.categoryName === 'rent' ? 'Nekretnine za najam' : 'Nekretnine za prodaju'}
    </p>
</header>

{loading ? <Spinner /> : listings && listings.length > 0 ? <>
<main>
    <ul className='categoryListings'>
        {listings.map((listing)=>(
           <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
        ))}
    </ul>
</main>
<br />
<br />
{lastFetchedListing && (
    <p className="loadMore" onClick={onFetchMoreListings}>Prikaži više</p>
)}

</> : <p>Nema liste za {params.categoryName}
{console.log(listings)}</p>}

    </div>
  )
}

export default Category