import { Text, UnorderedList } from "@chakra-ui/react";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import CountyElectionPartyList from "src/components/CountyElectionPartyList";
import { CountyCandidate } from "src/types/county_candidate_type";
import { CountyElectionDistrict } from "src/types/county_election_district_type";
import { GminaItem } from "src/types/rada_gmin_types";

interface Props {
	selectedDistrict: GminaItem;
}

const CountyElection = ({ selectedDistrict }: Props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [countyElectionDistrict, setCountyElectionDistrict] =
		useState<CountyElectionDistrict>();
	const [countyCandidates, setCountyCandidates] = useState<CountyCandidate[]>(
		[]
	);
	const [groupedCandidates, setGroupedCandidates] = useState<
		Record<string, CountyCandidate[]>
	>({});

	useEffect(() => {
		setIsLoading(true);
		fetch("src/assets/csv/okregi_rady_powiatow_utf8.csv")
			.then(response => response.text())
			.then(csvText => {
				const results = Papa.parse<CountyElectionDistrict>(csvText, {
					header: true,
					skipEmptyLines: true,
				});
				const filteredDistricts = results.data.filter(
					item =>
						item.Województwo === selectedDistrict.Województwo &&
						item.Powiat === selectedDistrict.Powiat
				);
				const properDistrict = filteredDistricts.find(item => {
					const borders = cleanAndSplit(item["Opis granic"]);

					return borders.includes(removePrefix(selectedDistrict.Gmina));
				});
				setCountyElectionDistrict(properDistrict);
			})
			.catch(error => {
				console.error("Error loading CSV:", error);
			});
	}, [selectedDistrict]);

	useEffect(() => {
		setIsLoading(true);
		fetch("src/assets/csv/kandydaci_rady_powiatow_utf8.csv")
			.then(response => response.text())
			.then(csvText => {
				const results = Papa.parse<CountyCandidate>(csvText, {
					header: true,
					skipEmptyLines: true,
				});
				const filteredData = results.data.filter(
					item =>
						item.Powiat === countyElectionDistrict?.Powiat &&
						item["Nr okręgu"] === countyElectionDistrict?.["Numer okręgu"]
				);

				setCountyCandidates(filteredData);
			})
			.catch(error => {
				console.error("Error loading CSV:", error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [countyElectionDistrict]);

	useEffect(() => {
		if (countyCandidates.length) {
			const grouped: Record<string, CountyCandidate[]> =
				countyCandidates.reduce(
					(acc: Record<string, CountyCandidate[]>, candidate) => {
						const uniqueKey = `${candidate["Nr listy"]}-${candidate["Nazwa komitetu"]}`;

						if (!acc[uniqueKey]) {
							acc[uniqueKey] = [];
						}

						acc[uniqueKey].push(candidate);

						return acc;
					},
					{}
				);

			setGroupedCandidates(grouped);
		}
	}, [countyCandidates]);

	if (isLoading) {
		return <Text>Ładowanie...</Text>;
	}

	if (!countyElectionDistrict) {
		return <Text>Brak danych albo nie ma wyborów danego typu w okręgu</Text>;
	}

	return (
		<UnorderedList
			px={0}
			spacing={4}>
			{Object.entries(groupedCandidates).map(([listNumber, candidates]) => (
				<CountyElectionPartyList
					key={listNumber}
					listNumber={listNumber}
					candidates={candidates}
				/>
			))}
		</UnorderedList>
	);
};

export default CountyElection;

const cleanAndSplit = (input: string) => {
	const preCleaned = input
		.replace(/miasto i gmina\s*/gi, "")
		.replace(/gmina i miasto\s*/gi, "")
		.replace(/gmina miejska\s*/gi, "")
		.replace(/gminy\s*/gi, "")
		.replace(/gmina\s*/gi, "")
		.replace(/miasto\s*/gi, "")
		.replace(/:\s*/g, "");

	let parts = preCleaned.split(/,\s*/);

	parts = parts.flatMap(part =>
		part.includes(" i ") ? part.split(/\s+i\s+/) : part
	);

	return parts.map(part => part.trim()).filter(Boolean);
};

const removePrefix = (input: string) => {
	const cleanedInput = input.replace(/^(gm\.|g\.|m\.)\s?/, "");
	return cleanedInput.trim();
};
