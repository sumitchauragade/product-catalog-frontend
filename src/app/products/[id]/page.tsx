// Product Detail Page
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Product, Review } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [productRes, reviewRes] = await Promise.all([
      api.get(`/products/${id}`),
      api.get(`/reviews/product/${id}`)
    ]);
    setProduct(productRes.data);
    setReviews(reviewRes.data.reviews);
    setAvgRating(reviewRes.data.average_rating);
    setTotalReviews(reviewRes.data.total_reviews);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleOrder = async () => {
    if (!isAuthenticated) return router.push('/auth/login');
    try {
      await api.post('/orders', { product_id: id, quantity });
      setMessage(`Order placed for ${quantity} item(s)`);
      fetchData();
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Order failed');
    }
  };

  const handleReview = async () => {
    if (!isAuthenticated) return router.push('/auth/login');
    try {
      await api.post('/reviews', { product_id: id, rating, comment });
      setComment('');
      setMessage('Review added successfully');
      fetchData();
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Review failed');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Product Info */}
      <div className="border rounded-lg p-6 mb-8">
        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
          {product.category}
        </span>
        <h1 className="text-3xl font-bold mt-3">{product.name}</h1>
        <p className="text-4xl font-bold mt-2">${product.price}</p>
        <p className="text-gray-500 mt-1">{product.stock} in stock</p>
        <p className="mt-1 text-yellow-500">
          ★ {avgRating || 'No ratings yet'} ({totalReviews} reviews)
        </p>

        {/* Place Order */}
        <div className="flex items-center gap-4 mt-6">
          <input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={e => setQuantity(parseInt(e.target.value))}
            className="border px-3 py-2 rounded w-20"
          />
          <button
            onClick={handleOrder}
            disabled={product.stock === 0}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
          >
            Place Order
          </button>
        </div>
        {message && <p className="mt-3 text-green-600">{message}</p>}
      </div>

      {/* Reviews */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        {reviews.length === 0 && (
          <p className="text-gray-500">No reviews yet. Be the first.</p>
        )}
        {reviews.map(review => (
          <div key={review.id} className="border rounded p-4 mb-3">
            <div className="flex justify-between">
              <span className="font-semibold">{review.reviewer}</span>
              <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
            </div>
            <p className="text-gray-700 mt-1">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Add Review */}
      {isAuthenticated && (
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Add Your Review</h2>
          <select
            value={rating}
            onChange={e => setRating(parseInt(e.target.value))}
            className="border px-3 py-2 rounded mb-3 w-full"
          >
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your review..."
            className="border px-3 py-2 rounded w-full mb-3 h-24"
          />
          <button
            onClick={handleReview}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Submit Review
          </button>
        </div>
      )}
    </div>
  );
}