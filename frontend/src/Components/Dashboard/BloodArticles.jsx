import React from "react"; // Import React for JSX

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
    <div className="p-8 bg-white/80 rounded-2xl shadow-xl border border-[#99B19C]/40">
      {" "}
      {/* Card container */}
      {/* Carousel only in Blood Article page */}
      <div className="w-full max-w-6xl mx-auto mb-10">
        {" "}
        {/* Carousel wrapper */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-lg border-2 border-[#99B19C]/50 h-[400px] md:h-[500px] w-full flex items-center justify-center">
          {" "}
          {/* Frame */}
          <img
            src={trendingArticles[carouselIndex].image} // Current slide image
            alt={trendingArticles[carouselIndex].title} // Alt text
            className="absolute top-0 left-0 w-full h-full object-contain transition-all duration-500 bg-white" // Image styling
            style={{ objectFit: "contain" }} // Force contain
          />
          <div
            className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start" // Caption area
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, rgba(255,255,255,0) 100%)", // Gradient for readability
            }}
          >
            <h2
              className="text-2xl md:text-4xl font-extrabold drop-shadow-lg mb-2"
              style={{ color: "#6D2932" }}
            >
              {" "}
              {/* Title */}
              {trendingArticles[carouselIndex].title}
            </h2>
            <p className="text-white text-lg drop-shadow mb-2">
              {" "}
              {/* Summary */}
              {trendingArticles[carouselIndex].summary}
            </p>
            <button
              className="text-[#99B19C] font-bold underline hover:text-[#6D2932] transition-colors duration-200 text-lg" // See more button
              onClick={() => openModal(trendingArticles[carouselIndex])} // Open modal with current article
            >
              See More
            </button>
          </div>
          {/* Carousel Controls */}
          <div className="absolute bottom-4 right-8 flex space-x-3">
            {" "}
            {/* Dots */}
            {trendingArticles.map((_, idx) => (
              <button
                key={idx} // Unique key
                className={`w-4 h-4 rounded-full ${
                  carouselIndex === idx ? "bg-[#99B19C]" : "bg-[#D7D1C9]"
                }`} // Active dot style
                onClick={() => setCarouselIndex(idx)} // Jump to slide
                aria-label={`Go to slide ${idx + 1}`} // Accessibility label
              ></button>
            ))}
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-6 text-[#6D2932] text-center">
        {" "}
        {/* Section title */}
        Trending Blood Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {" "}
        {/* Articles grid */}
        {trendingArticles.map((article) => (
          <div
            key={article.id} // Card key
            className="bg-white/90 rounded-xl shadow-lg border border-[#99B19C]/30 flex flex-col hover:shadow-2xl transition-shadow duration-300 overflow-hidden" // Card styling
            style={{ minHeight: "350px", position: "relative" }} // Minimum height
          >
            <div
              style={{ position: "relative", width: "100%", height: "200px" }}
            >
              {" "}
              {/* Image wrapper */}
              <img
                src={article.image} // Card image
                alt={article.title} // Alt text
                className="absolute top-0 left-0 w-full h-full object-contain bg-white rounded-t-xl" // Fit image
                style={{ objectFit: "contain" }} // Ensure contain
              />
            </div>
            <div className="p-4 flex-1 flex flex-col items-center justify-between">
              {" "}
              {/* Text/body */}
              <h3 className="text-lg font-bold text-[#6D2932] mb-2 text-center">
                {" "}
                {/* Card title */}
                {article.title}
              </h3>
              <p className="text-[#6D2932] text-xs mb-3 text-center">
                {" "}
                {/* Card summary */}
                {article.summary}
              </p>
              <button
                className="text-[#99B19C] font-semibold underline hover:text-[#6D2932] transition-colors duration-200 text-xs" // See more button
                onClick={() => openModal(article)} // Open modal with this article
              >
                See More
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Custom Modal for full article (no external dependency) */}
      {modalIsOpen && selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Modal backdrop */}
          <div
            className="absolute inset-0 bg-transparent"
            onClick={closeModal}
          ></div>
          {/* Modal body */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative z-10 animate-fade-in">
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
                    <iframe
                      width="320"
                      height="180"
                      src={`https://www.youtube.com/embed/${selectedArticle.youtubeId}`}
                      title="YouTube video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-xl shadow-lg"
                    ></iframe>
                  ) : (
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-64 h-64 object-contain rounded-xl shadow-lg"
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
          </div>
        </div>
      )}
    </div>
  );
}
