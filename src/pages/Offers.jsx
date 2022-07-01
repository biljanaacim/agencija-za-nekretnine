import { useEffect, useState } from "react";
//router
import { useParams } from "react-router-dom";
//firebase
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';
//toast
import { toast } from 'react-toastify';
//components
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

const Offers = () => {

    const [listings, setListings] = useState(null)
    const [loading, setLoading] = useState(true)
    const [lastFetchedListing, setLastFetchedListing] = useState(null)

    const params = useParams()

    useEffect(() => {

        const fetchListings = async () => {
            try {
                //get listing reference
                const listingsRef = collection(db, 'listings')

                //create query
                const q = query(listingsRef,
                    where('offer', '==', true),
                    orderBy('timestamp', 'desc'),
                    limit(10)
                )

                //execute query
                const querySnap = await getDocs(q)

                //get last listing in databse
                const lastVisible = querySnap.docs[querySnap.docs.length - 1]
                setLastFetchedListing(lastVisible)

                const listings = []

                querySnap.forEach((doc) => {
                    return listings.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })

                setListings(listings)
                setLoading(false)

            } catch (error) {
                toast.error('Nemoguće je preuzeti listu')
            }
        }

        fetchListings()
    }, [])

    //pagination load more
    const onFetchMoreListings = async () => {
        try {
            //get reference
            const listingsRef = collection(db, 'listings')

            //create query
            const q = query(listingsRef,
                where('offer', '==', true),
                orderBy('timestamp', 'desc'),
                startAfter(lastFetchedListing),
                limit(10)
            )

            //execute query
            const querySnap = await getDocs(q)

            //get last listing in databse
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)


            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })

            setListings((prevState) => [...prevState, ...listings])
            setLoading(false)

        } catch (error) {
            toast.error('Ne može se preuzeti lista')
        }
    }

    return (
        <div className="category">
            <header>
                <p className="pageHeader">
                   Ponuda
                </p>
            </header>

            {loading ? <Spinner /> : listings && listings.length > 0 ?
                <>
                    <main>
                        <ul className="categoryListings">
                            {listings.map((listing) => (
                                <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
                            ))}
                        </ul>
                    </main>

                    <br />
                    <br />

                    {lastFetchedListing && (
                        <p className="loadMore" onClick={onFetchMoreListings}>Prikaži više</p>
                    )}
                </>
                : <p>Nema trenutno ponude</p>}
        </div>
    );
}

export default Offers;