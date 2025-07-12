import React, { useState }  from "react";

const searchBar = ({ onSearch,loading }) => {
    const [query,setQuery] = useState('');
    
const handleSubmit = (e) => {
        e.preventDefault();
        if(query.trim()){
            onSearch(query.trim());
        }
    };

    return(
        <div className ="search-bar">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for movies..."
                    disabled={loading}
                />
                <button type="submit" 
                className="search-button"
                disabled={loading|| !query.trim()}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
        </div>

    );

};
export default searchBar;