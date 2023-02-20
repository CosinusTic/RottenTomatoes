const Profile = ({user}) => {
    async function updateUser(event){
        const response = await fetch('http://localhost')
    }
    return(
        <div>

            <div className="all">
            <div className="profile">
                <p> Username : {user.username}</p>
                <p>mail : {user.email}</p>
                <p>password : {user.password}</p>
                <label htmlFor="favourites">Your favourites ones :</label>
                <ul className="favourites" name="favourites" id="favourites">{user.favourites.map(favourite => <li>{favourite}</li>)}</ul>
            </div>
            <div>
                <div className="update">
                <h3>Update your profile</h3>
                <div className="formup">
                    New email: <input type="text"/>
                    New password: <input type="text"/>
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}

export default Profile;