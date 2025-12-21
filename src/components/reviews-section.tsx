"use client";

import { motion } from "framer-motion";
import { ChevronDown, Star, ThumbsUp, User } from "lucide-react";
import { useState } from "react";

type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
};
const REVIEWS: Review[] = [];

interface ReviewsSectionProps {
  serverName: string;
  averageRating?: number;
  totalReviews?: number;
}

export default function ReviewsSection({
  serverName,
  averageRating = 4.5,
  totalReviews = REVIEWS.length,
}: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<"recent" | "helpful">("recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    REVIEWS.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const sortedReviews = [...REVIEWS].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.helpful - a.helpful;
  });

  if (totalReviews === 0) {
    return (
      <div className="border border-border rounded-2xl bg-card p-12 text-center">
        <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No Reviews Yet
        </h3>
        <p className="text-muted-foreground">
          Be the first to review {serverName}!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-border rounded-2xl bg-card p-6"
      >
        <h3 className="text-2xl font-bold text-foreground mb-6">
          Reviews & Ratings
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-5xl font-bold text-foreground mb-3">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating))}
            <p className="text-sm text-muted-foreground mt-3">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="lg:col-span-2 space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating as keyof typeof distribution];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-16">
                    <span className="text-sm text-foreground font-medium">
                      {rating}
                    </span>
                    <Star className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 dark:bg-yellow-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right font-medium">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border border-border rounded-2xl bg-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-foreground">
            User Reviews ({totalReviews})
          </h4>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground hover:bg-muted/80 transition-all"
            >
              <span>
                {sortBy === "recent" ? "Most Recent" : "Most Helpful"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl overflow-hidden shadow-xl z-10 backdrop-blur-xl"
              >
                <button
                  onClick={() => {
                    setSortBy("recent");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                    sortBy === "recent"
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  Most Recent
                </button>
                <button
                  onClick={() => {
                    setSortBy("helpful");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                    sortBy === "helpful"
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  Most Helpful
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {sortedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border border-border rounded-xl p-5 bg-card/50 hover:bg-card transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-foreground">
                      {review.author}
                    </p>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                {review.comment}
              </p>

              <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
