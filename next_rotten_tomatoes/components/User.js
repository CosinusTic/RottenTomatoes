import style from '../styles/user.css'

const UserCard = () => {
    return(

        <div>
            <div className="user">
                <h1 className={style.title}>User</h1>
                <p className="username">Username</p>
                <p className="email">Email</p>
                <button className="update">update</button>
                <button className="delete">delete</button>
            </div>
        </div>

    )
}


export default UserCard