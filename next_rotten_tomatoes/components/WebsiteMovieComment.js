const WebsiteMovieComment = ({comment}) => {
    return(
        <div key={comment}>
            <h4>{comment.author}</h4>
            <p>{comment.comment}</p>
        </div>
    )
}

export default WebsiteMovieComment;