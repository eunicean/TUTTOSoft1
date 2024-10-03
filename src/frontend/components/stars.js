const React = require('react');
// import '../css/StarsRating.css';
require('../css/StarsRating.css');


const StarRating = ({ rating }) => {
    return (
        <div className="stars">
            {[1, 2, 3, 4, 5].map((value) => (
                <span
                    key={value}
                    className={`star ${value <= rating ? 'selected' : ''}`}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

export default StarRating;
