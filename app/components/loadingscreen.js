const LoadingScreen = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        src="/app/assets/animationcart.json"
        style={{ height: "300px", width: "300px" }}
      />
    </div>
  );
};

export default LoadingScreen;
