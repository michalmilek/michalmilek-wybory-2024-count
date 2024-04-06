import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import { Header } from "src/components";
import Candidates from "src/components/Candidates";
import { GminaItem } from "src/types/rada_gmin_types";

function App() {
	const [data, setData] = useState<GminaItem[]>([]);
	const [selectedWojewodztwo, setSelectedWojewodztwo] = useState("");
	const [selectedPowiat, setSelectedPowiat] = useState("");
	const [selectedGmina, setSelectedGmina] = useState("");
	const [wojewodztwa, setWojewodztwa] = useState<string[]>([]);
	const [powiaty, setPowiaty] = useState<string[]>([]);
	const [gminy, setGminy] = useState<string[]>([]);
	const [districts, setDistricts] = useState<GminaItem[]>([]);
	const [selectedDistrict, setSelectedDistrict] = useState<GminaItem | null>(
		null
	);
	const [isAbove20K, setIsAbove20K] = useState(false);

	useEffect(() => {
		fetch("src/assets/csv/obwody_glosowania_utf8.csv")
			.then(response => response.text())
			.then(csvText => {
				const results = Papa.parse(csvText, {
					header: true,
					skipEmptyLines: true,
				});
				setData(results.data as GminaItem[]);
				setWojewodztwa([
					...new Set(results.data.map(item => item.Województwo)),
				]);
			})
			.catch(error => console.error("Error loading CSV:", error));
	}, []);

	useEffect(() => {
		if (selectedWojewodztwo) {
			const filteredPowiaty = data
				.filter(item => item.Województwo === selectedWojewodztwo)
				.map(item => item.Powiat);
			setPowiaty([...new Set(filteredPowiaty)]);
			setSelectedPowiat("");
		}
	}, [selectedWojewodztwo, data]);

	useEffect(() => {
		if (selectedPowiat) {
			const filteredGminy = data
				.filter(item => item.Powiat === selectedPowiat)
				.map(item => item.Gmina);
			setGminy([...new Set(filteredGminy)]);
		}
	}, [selectedPowiat, data]);

	useEffect(() => {
		if (selectedGmina) {
			const filteredCandidates = data.filter(
				item => item.Gmina === selectedGmina
			);
			setDistricts(filteredCandidates);
		}
	}, [selectedGmina, data]);

	const uniqueGminyOptions = useMemo(
		() =>
			gminy.map(gmina => (
				<option
					key={gmina}
					value={gmina}>
					{gmina}
				</option>
			)),
		[gminy]
	);

	return (
		<>
			<Header />
			<div className="flex items-center gap-10">
				<select
					onChange={e => setSelectedWojewodztwo(e.target.value)}
					value={selectedWojewodztwo}>
					<option value="">Wybierz województwo</option>
					{wojewodztwa.map(woj => (
						<option
							key={woj}
							value={woj}>
							{woj}
						</option>
					))}
				</select>

				<select
					onChange={e => setSelectedPowiat(e.target.value)}
					value={selectedPowiat}
					disabled={!selectedWojewodztwo}>
					<option value="">Wybierz powiat</option>
					{powiaty.map(pow => (
						<option
							key={pow}
							value={pow}>
							{pow}
						</option>
					))}
				</select>

				<select
					onChange={e => setSelectedGmina(e.target.value)}
					disabled={!selectedPowiat}>
					<option value="">Wybierz gminę</option>
					{uniqueGminyOptions}
				</select>

				<label>
					<input
						type="checkbox"
						checked={isAbove20K}
						onChange={() => setIsAbove20K(!isAbove20K)}
					/>
					Powyżej 20 tys. mieszkańców
				</label>

				<select
					onChange={e =>
						setSelectedDistrict(
							districts.find(district => district.Numer === e.target.value)
						)
					}
					value={selectedDistrict?.Numer || ""}
					disabled={!selectedGmina}>
					<option value="">Wybierz okręg</option>
					{districts.map((district, index) => (
						<option
							key={index}
							value={district.Numer}>
							{district.Numer}. {district.Miejscowość} {district.Ulica}{" "}
							{district["Numer lokalu"]} {district["Numer posesji"]}
						</option>
					))}
				</select>
			</div>
			{selectedDistrict && (
				<Candidates
					isAbove20K={isAbove20K}
					selectedDistrict={selectedDistrict}
				/>
			)}
		</>
	);
}

export default App;
