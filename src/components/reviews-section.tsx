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
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400"
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
      <div className="border-border bg-card rounded-2xl border p-12 text-center">
        <Star className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
        <h3 className="text-foreground mb-2 text-xl font-semibold">
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
        className="border-border bg-card rounded-2xl border p-6"
      >
        <h3 className="text-foreground mb-6 text-2xl font-bold">
          Reviews & Ratings
        </h3>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-foreground mb-3 text-5xl font-bold">
              {averageRating.toFixed(1)}
            </div>
            {renderStars(Math.round(averageRating))}
            <p className="text-muted-foreground mt-3 text-sm">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="space-y-3 lg:col-span-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating as keyof typeof distribution];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex w-16 items-center gap-2">
                    <span className="text-foreground text-sm font-medium">
                      {rating}
                    </span>
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
                  </div>
                  <div className="bg-muted h-2.5 flex-1 overflow-hidden rounded-full">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-500 dark:bg-yellow-400"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground w-12 text-right text-sm font-medium">
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
        className="border-border bg-card rounded-2xl border p-6"
      >
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-foreground text-lg font-semibold">
            User Reviews ({totalReviews})
          </h4>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-muted border-border text-foreground hover:bg-muted/80 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all"
            >
              <span>
                {sortBy === "recent" ? "Most Recent" : "Most Helpful"}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-card border-border absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-xl border shadow-xl backdrop-blur-xl"
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
              className="border-border bg-card/50 hover:bg-card rounded-xl border p-5 transition-all"
            >
              <div className="mb-4 flex items-start gap-4">
                <div className="bg-muted border-border flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border">
                  <User className="text-muted-foreground h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-foreground font-semibold">
                      {review.author}
                    </p>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <p className="text-foreground/90 mb-4 text-sm leading-relaxed">
                {review.comment}
              </p>

              <button className="text-muted-foreground hover:text-primary flex items-center gap-2 text-xs transition-colors">
                <ThumbsUp className="h-4 w-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
