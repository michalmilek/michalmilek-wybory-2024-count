import {
	Button,
	Checkbox,
	Flex,
	Heading,
	Select,
	Spinner,
	Text,
} from "@chakra-ui/react";
import Papa from "papaparse";
import { useEffect, useMemo, useState } from "react";
import { Header } from "src/components";
import VotingType from "src/components/VotingType";
import { GminaItem } from "src/types/rada_gmin_types";
import { clearVotesFromLocalStorage } from "src/utils/utils";

function MainPage() {
	const [data, setData] = useState<GminaItem[]>([]);
	const [selectedWojewodztwo, setSelectedWojewodztwo] = useState("");
	const [selectedPowiat, setSelectedPowiat] = useState("");
	const [selectedGmina, setSelectedGmina] = useState("");
	const [wojewodztwa, setWojewodztwa] = useState<string[]>([]);
	const [powiaty, setPowiaty] = useState<string[]>([]);
	const [gminy, setGminy] = useState<string[]>([]);
	const [districts, setDistricts] = useState<GminaItem[]>([]);
	const [selectedDistrict, setSelectedDistrict] = useState<GminaItem>();
	const [isAbove20K, setIsAbove20K] = useState(false);
	const [isoLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch("/csv/obwody_glosowania_utf8.csv")
			.then(response => response.text())
			.then(csvText => {
				const results = Papa.parse<GminaItem>(csvText, {
					header: true,
					skipEmptyLines: true,
				});
				setData(results.data);
				setWojewodztwa([
					...new Set(results.data.map(item => item.Województwo)),
				]);
			})
			.catch(error => console.error("Error loading CSV:", error))
			.finally(() => {
				setIsLoading(false);
			});
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
			{isoLoading ? (
				<div className="min-h-60vh mt-20 w-full flex items-center justify-center">
					<Spinner size="xl" />
				</div>
			) : (
				<Flex
					flexDir={"column"}
					gap={"4"}
					px={10}>
					<Text my={6}>
						Uwaga! Duże miasta mogą być na dole listy powiatów, np. jeśli
						twojego OKW nie ma na liscie, to poszukaj innego powiatu.
					</Text>
					<Text my={6}>
						Uwaga2! Proszę pamietać o ręcznym zaznaczeniu "Miasto/Wieś powyżej
						20 tyś."!!!
					</Text>
					<Flex>
						<Text>
							Po skończonych wyborach wyczyść sobie pamięć podręczną urządzenia
							naciskając na przycisk
						</Text>
						<Button onClick={clearVotesFromLocalStorage}>Wyczyść</Button>
					</Flex>
					<Heading
						size={"lg"}
						as="h2">
						Znajdź swoją komisję
					</Heading>
					<Flex className="flex items-center gap-10 flex-wrap mb-8">
						<Select
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
						</Select>

						<Select
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
						</Select>

						<Select
							onChange={e => setSelectedGmina(e.target.value)}
							disabled={!selectedPowiat}>
							<option value="">Wybierz gminę</option>
							{uniqueGminyOptions}
						</Select>

						<label
							htmlFor="above-20k"
							className="flex items-center gap-2 select-none cursor-pointer">
							<Checkbox
								id="above-20k"
								checked={isAbove20K}
								onChange={() => setIsAbove20K(!isAbove20K)}
							/>
							Miasto/Wieś powyżej 20 tys. mieszkańców
						</label>

						<Select
							onChange={e => {
								setSelectedDistrict(
									districts.find(district => district.Numer === e.target.value)
								);
							}}
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
						</Select>
						{selectedDistrict && (
							<VotingType
								isAbove20K={isAbove20K}
								selectedDistrict={selectedDistrict}
							/>
						)}
					</Flex>
				</Flex>
			)}
		</>
	);
}

export default MainPage;
