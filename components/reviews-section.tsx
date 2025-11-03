"use client";

import { motion } from "framer-motion";
import { Star, ThumbsUp, User } from "lucide-react";
import { useState } from "react";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface ReviewsSectionProps {
  serverName: string;
  averageRating?: number;
  totalReviews?: number;
  reviews?: Review[];
}

export default function ReviewsSection({
  serverName,
  averageRating = 0,
  totalReviews = 0,
  reviews = [],
}: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent");

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-500"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.helpful - a.helpful;
  });

  if (totalReviews === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border border-white/10 rounded-xl bg-white/[0.02] p-8 text-center"
      >
        <Star className="w-12 h-12 text-gray-500/50 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white/95 mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-400/70">Be the first to review {serverName}!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Rating Overview */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] p-6">
        <h3 className="text-2xl font-bold text-white/95 mb-6">
          Reviews & Ratings
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center lg:border-r border-white/10">
            <div className="text-5xl font-bold text-white/95 mb-2">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating))}
            <p className="text-sm text-gray-400/70 mt-2">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="lg:col-span-2 space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating as keyof typeof distribution];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm text-gray-300/90">{rating}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400/70 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="border border-white/10 rounded-xl bg-white/[0.02] p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-white/95">
            User Reviews ({totalReviews})
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400/70">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "recent" | "helpful")
              }
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/90 focus:outline-none focus:border-white/20 transition-all"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {sortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-white/10 rounded-lg p-5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white/90">{review.author}</p>
                    <p className="text-xs text-gray-400/70">
                      {new Date(review.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {renderStars(review.rating)}
              </div>

              <p className="text-sm text-gray-300/90 mb-3 leading-relaxed">
                {review.comment}
              </p>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-xs text-gray-400/70 hover:text-cyan-400 transition-colors">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
