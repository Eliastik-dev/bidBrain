import React, { useState } from 'react';

interface Post {
    id: number;
    title: string;
    content: string;
    date: string;
    comments: Comment[];
}

interface Comment {
    id: number;
    content: string;
    date: string;
}

const MiniBlog: React.FC<{ cryptoId: string }> = ({ cryptoId }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
    const [newComment, setNewComment] = useState<{ [postId: number]: string }>({});

    const addPost = () => {
        const post: Post = {
            id: posts.length + 1,
            title: newPost.title,
            content: newPost.content,
            date: new Date().toLocaleDateString(),
            comments: []
        };
        setPosts([...posts, post]);
        setNewPost({ title: '', content: '' });
    };

    const deletePost = (id: number) => {
        setPosts(posts.filter(post => post.id !== id));
    };

    const addComment = (postId: number) => {
        const comment: Comment = {
            id: posts.find(post => post.id === postId)!.comments.length + 1,
            content: newComment[postId],
            date: new Date().toLocaleDateString()
        };
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, comments: [...post.comments, comment] } 
                : post
        ));
        setNewComment({ ...newComment, [postId]: '' });
    };

    return (
        <div>
            <h2>Mini-Blog pour {cryptoId}</h2>
            <div>
                <input
                    type="text"
                    placeholder="Titre"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                />
                <textarea
                    placeholder="Contenu"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                />
                <button onClick={addPost}>Publier</button>
            </div>
            <div>
                {posts.map(post => (
                    <div key={post.id}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>
                        <small>{post.date}</small>
                        <button onClick={() => deletePost(post.id)}>Supprimer</button>
                        <div>
                            <h4>Commentaires</h4>
                            <textarea
                                placeholder="Ajouter un commentaire"
                                value={newComment[post.id] || ''}
                                onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                            />
                            <button onClick={() => addComment(post.id)}>Commenter</button>
                            {post.comments.map(comment => (
                                <div key={comment.id}>
                                    <p>{comment.content}</p>
                                    <small>{comment.date}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MiniBlog;