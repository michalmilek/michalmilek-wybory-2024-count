import { Box, Heading, Skeleton, UnorderedList } from "@chakra-ui/react";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import RegionalParliamentCandidatesPartyList from "src/components/RegionalParliamentCandidatesPartyList";
import { GminaItem } from "src/types/rada_gmin_types";
import { RegionalParliamentDistrict } from "src/types/regional_parliament_district_type";
import { RegionalParliamentCandidate } from "src/types/regional_parliament_type";

interface Props {
	selectedDistrict: GminaItem;
}

const RegionalParliament = ({ selectedDistrict }: Props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [regionalCandidates, setRegionalCandidates] = useState<
		RegionalParliamentCandidate[]
	>([]);
	const [parliamentDistrict, setParliamentDistrict] =
		useState<RegionalParliamentDistrict>();

	useEffect(() => {
		setIsLoading(true);
		fetch("/csv/okregi_sejmiki_wojewodztw_utf8.csv")
			.then(response => response.text())
			.then(csvText => {
				const results = Papa.parse<RegionalParliamentDistrict>(csvText, {
					header: true,
					skipEmptyLines: true,
				});
				const properDistrict = results.data.find(item => {
					const cleanedInput = item["Opis granic"]
						.replace("miasto ", "")
						.replace("powiaty: ", "");

					const separators = /; |, /;
					const array = cleanedInput
						.split(separators)
						.filter(item => item.trim() !== "");

					return array.includes(selectedDistrict.Gmina);
				});
				setParliamentDistrict(properDistrict);
			})
			.catch(error => {
				console.error("Error loading CSV:", error);
			});
	}, [selectedDistrict]);

	useEffect(() => {
		if (parliamentDistrict) {
			setIsLoading(true);
			fetch("/csv/kandydaci_sejmiki_wojewodztw_utf8.csv")
				.then(response => response.text())
				.then(csvText => {
					const results = Papa.parse<RegionalParliamentCandidate>(csvText, {
						header: true,
						skipEmptyLines: true,
					});

					const filteredCandidates = results.data.filter(
						candidate =>
							candidate.Województwo === selectedDistrict.Województwo &&
							candidate["Nr okręgu"] === parliamentDistrict["Numer okręgu"]
					);
					setRegionalCandidates(filteredCandidates);
				})
				.catch(error => {
					console.error("Error loading CSV:", error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [selectedDistrict, parliamentDistrict]);

	const [groupedCandidates, setGroupedCandidates] = useState<
		Record<string, RegionalParliamentCandidate[]>
	>({});
	useEffect(() => {
		if (regionalCandidates.length) {
			const grouped: Record<string, RegionalParliamentCandidate[]> =
				regionalCandidates.reduce(
					(
						acc: Record<string, RegionalParliamentCandidate[]>,
						regionalCandidates
					) => {
						const uniqueKey = `${regionalCandidates["Nr listy"]}-${regionalCandidates["Nazwa komitetu"]}`;

						if (!acc[uniqueKey]) {
							acc[uniqueKey] = [];
						}

						acc[uniqueKey].push(regionalCandidates);

						return acc;
					},
					{}
				);

			setGroupedCandidates(grouped);
		}
	}, [regionalCandidates]);

	if (isLoading) {
		return (
			<Skeleton
				height="350px"
				w={"100%"}
			/>
		);
	}

	return (
		<Box className="w-full">
			<Heading
				as="h2"
				size="lg"
				fontWeight="bold"
				mb={8}>
				Listy
			</Heading>
			<UnorderedList
				px={0}
				spacing={4}>
				{Object.entries(groupedCandidates).map(([listNumber, candidates]) => (
					<RegionalParliamentCandidatesPartyList
						key={listNumber}
						listNumber={listNumber}
						candidates={candidates}
					/>
				))}
			</UnorderedList>
		</Box>
	);
};

export default RegionalParliament;
