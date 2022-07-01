//router
import { Link } from 'react-router-dom';
//icons
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import { ReactComponent as EditIcon } from '../assets/svg/editIcon.svg';
import bedIcon from '../assets/svg/bedIcon.svg';
import bathtubIcon from '../assets/svg/bathtubIcon.svg';


const ListingItem = ({ listing, id, onDelete, onEdit }) => {
    return (
        <li className='categoryListing'>
            <Link to={`/category/${ listing.type }/${ id }`} className='categoryListingLink'>
                <img src={listing.imgUrls[0]} alt={listing.name} className='categoryListingImg' />
                <div className="categoryListingDetails">
                    <p className="categoryListingLocation">
                        {listing.location}
                    </p>
                    <p className='categoryListingName'>
                        {listing.name}
                    </p>
                    <p className="categoryListingPrice">
                        € {listing.offer
                            ? listing.discountedPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                            : listing.regularPrice
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        {listing.type === 'rent' && ' / mesečno'}
                    </p>
                    <div className="categoryListingInfoDiv">
                        <img src={bedIcon} alt="bed" />
                        <p className="categoryListingInfoText">
                            {listing.bedrooms > 1 ? `${ listing.bedrooms } spavaće sobe` : '1 spavaća soba'}
                        </p>
                        <img src={bathtubIcon} alt="bath" />
                        <p className="categoryListingInfoText">
                            {listing.bathrooms > 1 ? `${ listing.bathrooms } kupatiloa` : '1 kupotilo'}
                        </p>
                    </div>
                </div>
            </Link>
            {onDelete && (
                <DeleteIcon className='removeIcon' fill='rgb(231,76,60)' onClick={() => onDelete(listing.id, listing.name)} />
            )}

            {onEdit && (
                <EditIcon className='editIcon' onClick={() => onEdit(id)} />
            )}
        </li>
    );
}

export default ListingItem;