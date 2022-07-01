//firebase
import { getAuth, updateProfile } from 'firebase/auth';
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
//hooks
import { useEffect, useState } from 'react';
//router 
import { useNavigate, Link } from 'react-router-dom';
//toast
import { toast } from 'react-toastify';
//icons
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import homeIcon from '../assets/svg/homeIcon.svg';
//components
import ListingItem from '../components/ListingItem';


const Profile = () => {

    const auth = getAuth()
    const navigate = useNavigate()

    const [changeDetails, setChangeDetails] = useState(false)
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null)

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email
    })

    const { name, email } = formData

    useEffect(() => {
        const fetchUserListings = async () => {
            const listingsRef = collection(db, 'listings')
            const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))
            const querySnap = await getDocs(q)

            const listings = []

            querySnap.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data()
                })
            })
            setLoading(false)
            setListings(listings)
        }
        fetchUserListings()
    }, [auth.currentUser.uid])

    const onLogout = () => {
        auth.signOut()
        navigate('/')
    }

    const onSubmit = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                //update displayName in firebase
                await updateProfile(auth.currentUser, {
                    displayName: name
                })

                //update displayName in firestore
                const userRef = doc(db, 'users', auth.currentUser.uid)
                await updateDoc(userRef, {
                    name: name
                })
            }
        } catch (error) {
            toast.error('Ne mogu se ažurirati podaci o korisniku')
        }
    }

    const onChange = (e) => {
        setFormData(prevState => (
            {
                ...prevState,
                [e.target.id]: e.target.value
            }
        ))
    }

    const onDelete = async (listingId) => {
        if (window.confirm('Jeste li sigurni da želite obrisati?')) {
            //there are 2 ways to delete a doc from firebase. 1) get docRef using doc() and then pass docRef in deleteDoc()
            //2):
            await deleteDoc(doc(db, 'listings', listingId))
            //update the listings on UI
            const updatedListings = listings.filter((listing) => listing.id !== listingId)
            setListings(updatedListings)
            toast.success('Uspešno obrisana lista')
        }
    }

    const onEdit = (listingId) => {
        navigate(`/edit-listing/${ listingId }`)
    }

    return (
        <div className='profile'>
            <header className="profileHeader">
                <p className="pageHeader">Moj profil</p>
                <button type='button' onClick={onLogout} className="logOut">Odjavi se</button>
            </header>

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">Detalji o korisniku</p>
                    <p className="changePersonalDetails" onClick={() => {
                        changeDetails && onSubmit()
                        setChangeDetails(prevState => !prevState)
                    }
                    }>
                        {changeDetails ? 'Gotovo' : 'Promeni'}
                    </p>
                </div>
                <div className="profileCard">
                    <form>
                        <input
                            type="text"
                            id="name"
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChange}
                            className={!changeDetails ? 'profileName' : 'profileNameActive'} />
                        <input
                            type="email"
                            id="email"
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChange}
                            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} />
                    </form>
                </div>
                <Link to='/create-listing' className='createListing' >
                    <img src={homeIcon} alt="home" />
                    <p>Prodaj ili iznajmi svoj dom</p>
                    <img src={arrowRight} alt="arrow right" />
                </Link>

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Tvoja lista</p>
                        <ul className="listigsList">
                            {listings.map((listing) => (
                                <ListingItem key={listing.id} 
                                listing={listing.data} 
                                id={listing.id} 
                                onDelete={() => onDelete(listing.id)} 
                                onEdit={() => onEdit(listing.id)} />
                            ))}
                        </ul>
                    </>
                )}
            </main >
        </div >
    )
}

export default Profile;