import { useEffect, useRef, useState } from "react"

interface Posts {
    "userId": number,
    "id": number,
    "title": string,
    "body": string
}


/**
 * 
 * @returns 
 */

const AbortControllerSample = () => {
    const AbortControllerRef = useRef<AbortController | null>(null);
    const [postId, setPostId] = useState(1);
    const [post, setPost] = useState<Posts>();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notLoaded, setNotLoaded] = useState<Number[]>([])
    const BASE_API_URL = "https://jsonplaceholder.typicode.com/posts/";

    useEffect(() => {
        AbortControllerRef.current?.abort();
        AbortControllerRef.current = new AbortController();

        const fetchUrl = BASE_API_URL + postId;
        const fetchPost = async () => {
            try {
                const response = await fetch(fetchUrl, {
                    signal: AbortControllerRef.current?.signal
                });
                const post = await response.json();
                setError(null);
                setIsLoading(false);
                setPost(post);
            } catch (error) {
                if (error.name === "AbortError") {
                    setError(error);
                    setNotLoaded(notLoaded => [...notLoaded, postId]);
                    setIsLoading(false);
                }
            }
        };
        fetchPost();
    }, [postId]);

    const onClickHandler = () => {
        setPostId(postId + 1);
    }

    return (
        <div className="tutorial-shorts">
            {isLoading && <span>Loading...</span>}
            {post && <div>ID [{post.id}]<p className="post">{post.title}</p></div>}
            {notLoaded && <p className="warning notloaded">Unloaded postIDs: [{notLoaded.toString()}]</p>}
            {error && <p className="error"><br />{error.toString()}</p>}
            <button onClick={onClickHandler}>Next</button>
        </div>
    )
}

export default AbortControllerSample;