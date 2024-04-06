import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "src/pages/MainPage";

const App = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path="/"
					Component={MainPage}
				/>
			</Routes>
		</BrowserRouter>
	);
};

export default App;
