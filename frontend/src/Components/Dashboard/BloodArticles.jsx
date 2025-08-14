import React from "react"; // Import React for JSX
import { motion, AnimatePresence } from "framer-motion";

// BloodArticles renders carousel + articles list and article modal
export default function BloodArticles({
  trendingArticles, // Array of articles with id, title, image, summary, content
  carouselIndex, // Active carousel index
  setCarouselIndex, // Setter for active index
  modalIsOpen, // Modal open state
  selectedArticle, // Currently selected article
  openModal, // Open modal handler
  closeModal, // Close modal handler
}) {
  return (
    <div className="p-6 min-h-screen bg-[#FAF5EF]">
      {/* Carousel */}
      <div className="w-full max-w-5xl mx-auto mb-12">
        <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white border-2 border-[#C7B7A3] h-[350px] md:h-[420px] flex items-center justify-center">
          <img
            src={trendingArticles[carouselIndex].image}
            alt={trendingArticles[carouselIndex].title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#6D2932]/80 to-transparent">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-1">
              {trendingArticles[carouselIndex].title}
            </h2>
            <p className="text-white text-base mb-2">
              {trendingArticles[carouselIndex].summary}
            </p>
            <button
              className="text-[#C7B7A3] font-bold underline hover:text-[#6D2932] transition-colors duration-200 text-base"
              onClick={() => openModal(trendingArticles[carouselIndex])}
            >
              See More
            </button>
          </div>
          {/* Carousel Dots */}
          <div className="absolute bottom-4 right-6 flex space-x-2">
            {trendingArticles.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  carouselIndex === idx ? "bg-[#6D2932]" : "bg-[#C7B7A3]"
                }`}
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
      {/* Articles Grid */}
      <h2 className="text-2xl font-bold mb-8 text-[#6D2932] text-center">
        Trending Blood Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {trendingArticles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl border-l-4 border-[#6D2932] shadow-md flex flex-col hover:-translate-y-2 hover:shadow-xl transition-all duration-300 overflow-hidden"
            style={{ minHeight: "340px" }}
          >
            <div style={{ width: "100%", height: "180px" }}>
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex-1 flex flex-col items-center justify-between">
              <h3 className="text-lg font-bold text-[#6D2932] mb-2 text-center">
                {article.title}
              </h3>
              <p className="text-[#6D2932] text-xs mb-3 text-center">
                {article.summary}
              </p>
              <button
                className="text-[#C7B7A3] font-semibold underline hover:text-[#6D2932] transition-colors duration-200 text-xs"
                onClick={() => openModal(article)}
              >
                See More
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Modal */}
      <AnimatePresence>
        {modalIsOpen && selectedArticle && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-transparent"
              onClick={closeModal}
            ></div>
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 max-w-lg w-full relative z-10 overflow-y-auto max-h-[95vh]"
            >
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-[#6D2932] text-xl font-bold hover:text-[#99B19C]"
                aria-label="Close"
              >
                &times;
              </button>
              {selectedArticle && (
                <>
                  {/* Show YouTube video if youtubeId exists, else show image */}
                  <div className="w-full flex justify-center mb-6">
                    {selectedArticle.youtubeId ? (
                      <div className="w-full aspect-video max-w-[480px]">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${selectedArticle.youtubeId}`}
                          title="YouTube video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-xl shadow-lg w-full h-full"
                        ></iframe>
                      </div>
                    ) : (
                      <img
                        src={selectedArticle.image}
                        alt={selectedArticle.title}
                        className="w-full max-h-64 object-contain rounded-xl shadow-lg"
                      />
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-[#6D2932] mb-2 text-center">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-[#6D2932] text-sm mb-4 text-center">
                    {selectedArticle.summary}
                  </p>
                  <div className="text-[#6D2932] text-xs text-left whitespace-pre-line">
                    {selectedArticle.content}
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
