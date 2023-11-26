import { useState, useEffect } from "react";

const App = () => {
  const [text, setText] = useState<string>("");
  const [responseText, setResponseText] = useState<string>("");
  const [recipeArray, setRecipeArray] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const modifiedText = responseText.replace(/\n\n/g, "<br />");
    setRecipeArray(modifiedText.split("\n"));
  }, [responseText]);

  const handleApiRequest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/create-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setResponseText(data.data);
    } catch (error) {
      console.error("API isteği başarısız:", error);
      setResponseText("API isteği başarısız");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleApiRequest();
    }
  };

  return (
    <div className="flex flex-col items-center py-10 h-screen w-full md:w-1/2 mx-auto px-6 md:px-0">
      <h1 className="text-2xl mb-2">Bugün Ne Pişirsem?</h1>
      <p className="text-lg">Elindeki malzemeleri gir ve yemek tarifi al</p>
      <div className="mb-4 w-full flex items-center justify-center gap-4 mt-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={handleKeyPress}
          className="border border-gray-300 w-full rounded py-4 px-2 focus:outline-none focus:border-blue-500"
          placeholder="Metni buraya yazın"
        />
        <button
          disabled={isLoading}
          onClick={handleApiRequest}
          className="bg-blue-500 text-white py-4 px-8 rounded cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
        >
          Gönder
        </button>
      </div>
      {isLoading ? (
        <p className="text-center text-xl">Yükleniyor...</p>
      ) : (
        <div>
          {recipeArray.map((line, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
