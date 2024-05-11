import React, {useState, useEffect} from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [newProductName, setNewProductName] = useState("");
  const [newProductRating, setNewProductRating] = useState(null);
  const [editProductId, setEditProductId] = useState(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductRating, setEditProductRating] = useState(null);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: newProductName,
      rating: parseInt(newProductRating),
      favorite: false,
      reviews: [],
    };
    setProducts([...products, newProduct]);
    setNewProductName("");
    setNewProductRating(null);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const toggleFavorite = (id) => {
    const updatedProducts = products.map((product) =>
      product.id === id ? {...product, favorite: !product.favorite} : product
    );
    setProducts(updatedProducts);
  };

  const addReview = (productId, reviewContent, rating) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? {
            ...product,
            reviews: [
              ...product.reviews,
              {content: reviewContent, rating: rating},
            ],
          }
        : product
    );
    setProducts(updatedProducts);
  };

  const editProduct = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditProductId(productId);
    setEditProductName(productToEdit.name);
    setEditProductRating(productToEdit.rating);
  };

  const saveEditedProduct = () => {
    const updatedProducts = products.map((product) =>
      product.id === editProductId
        ? {...product, name: editProductName, rating: editProductRating}
        : product
    );
    setProducts(updatedProducts);
    setEditProductId(null);
  };

  return (
    <div className="product-management">
      <h1>Product Management</h1>
      <div className="add-product-form">
        <input
          type="text"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
          placeholder="Product name"
        />
        <input
          type="number"
          value={newProductRating}
          min={1}
          max={5}
          onChange={(e) => setNewProductRating(e.target.value)}
          placeholder="Rating (1-5)"
        />
        <button onClick={addProduct}>Add Product</button>
      </div>
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <h3>{product.name}</h3>
          <div className="rating">
            {[
              ...Array(
                editProductId === product.id
                  ? parseInt(editProductRating)
                  : parseInt(product.rating)
              ),
            ].map((_, index) => (
              <span key={index} role="img" aria-label="star">
                &#9733;
              </span>
            ))}
          </div>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
          <button onClick={() => toggleFavorite(product.id)}>
            {product.favorite ? "❤️" : "🖤"}
          </button>
          <button onClick={() => editProduct(product.id)}>Edit</button>
          {editProductId === product.id && (
            <div className="edit-form">
              <input
                type="text"
                value={editProductName}
                onChange={(e) => setEditProductName(e.target.value)}
              />
              <input
                type="number"
                value={editProductRating}
                min={1}
                max={5}
                onChange={(e) => setEditProductRating(e.target.value)}
              />
              <button onClick={saveEditedProduct}>Save</button>
            </div>
          )}
          <ul className="reviews-list">
            {product.reviews.map((review, index) => (
              <li key={index} className="review-item">
                <p>Rating: {review.rating}</p>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
          <form
            className="review-form"
            onSubmit={(e) => {
              e.preventDefault();
              const reviewContent = e.target.review.value;
              const rating = e.target.rating.value;
              addReview(product.id, reviewContent, rating);
              e.target.reset();
            }}>
            <input
              type="text"
              name="review"
              placeholder="Write a review"
              required
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating (1-5)"
              min="1"
              max="5"
              required
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      ))}
    </div>
  );
}

export default App;
