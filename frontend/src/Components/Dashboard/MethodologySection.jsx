import React from "react"; // Import React for JSX

// MethodologySection shows charts/diagrams and explanatory text
export default function MethodologySection({
  heroPic3,
  modelAccuracy,
  confusionMatrix,
}) {
  return (
    <div className="p-8 bg-white/80 rounded-2xl">
      {" "}
      {/* Container card */}
      <h2 className="text-2xl font-bold mb-4 text-[#6D2932]">
        {" "}
        {/* Title */}
        Methodology
      </h2>
      <p className="text-[#6D2932] text-sm mb-6">
        {" "}
        {/* Intro text */}
        The bar chart below shows the number of samples for each blood group in
        our dataset. A- is the most common, while A+ is the least. This helps us
        understand the distribution of blood types in our data.
      </p>
      <div className="flex justify-center mb-8">
        {" "}
        {/* Distribution image */}
        <img
          src={heroPic3}
          alt="Blood Group Distribution Diagram"
          className="w-full max-w-2xl rounded-xl"
        />{" "}
        {/* Chart image */}
      </div>
      <p className="text-[#6D2932] text-sm mb-6">
        {" "}
        {/* Accuracy description */}
        The line chart below shows how the model’s accuracy improves as it
        trains. Both training and validation accuracy increase over time,
        reaching 94.88%.With this accuracy, our model reliably predicts blood
        groups from fingerprints. This high score means the system is effective
        and ready for real-world use.
      </p>
      <div className="flex justify-center mb-4">
        {" "}
        {/* Accuracy image */}
        <img
          src={modelAccuracy}
          alt="Model Accuracy Chart"
          className="w-full max-w-2xl rounded-xl"
        />{" "}
        {/* Chart image */}
      </div>
      <p className="text-[#6D2932] text-sm mb-6">
        {" "}
        {/* Confusion matrix explanation */}
        The confusion matrix above shows that most predictions match the true
        blood group labels, with very few misclassifications. This demonstrates
        the model’s reliability across all blood types.
      </p>
      <div className="flex justify-center mb-4">
        {" "}
        {/* Confusion matrix image */}
        <img
          src={confusionMatrix}
          alt="Confusion Matrix"
          className="w-full max-w-2xl rounded-xl"
        />{" "}
        {/* Matrix image */}
      </div>
      <p className="text-[#6D2932] text-sm text-center"></p>{" "}
      {/* Placeholder for optional notes */}
    </div>
  );
}
