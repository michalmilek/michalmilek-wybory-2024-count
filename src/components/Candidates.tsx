import { Box, Heading, Skeleton, UnorderedList } from "@chakra-ui/react";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import CandidatesPartyList from "src/components/CandidatesPartyList";
import { Candidate } from "src/types/candidate_type";
import { CommunityCouncil } from "src/types/community_council_type";
import { GminaItem } from "src/types/rada_gmin_types";

interface Props {
	selectedDistrict: GminaItem;
	isAbove20K?: boolean;
}

const Candidates = ({ selectedDistrict, isAbove20K }: Props) => {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [communityCouncil, setCommunityCouncil] = useState<CommunityCouncil>();
	const [groupedCandidates, setGroupedCandidates] = useState<
		Record<string, Candidate[]>
	>({});
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);
		fetch("src/assets/csv/okregi_rady_gmin_utf8.csv")
			.then(response => response.text())
			.then(csvText => {
				const results = Papa.parse<CommunityCouncil>(csvText, {
					header: true,
					skipEmptyLines: true,
				});

				const properCouncil = results.data.find(item => {
					const separators = /, |: /;
					const items = item["Opis granic"]
						.split(separators)
						.filter(item => !/ulice/i.test(item));
					const separatedStreetsFromDistrict = selectedDistrict["Opis granic"]
						.split(separators)
						.filter(street => !/ulice/i.test(street))
						.slice(0, 4);
					return separatedStreetsFromDistrict.every(street =>
						items.includes(street)
					);
				});
				console.log("🚀 ~ properCouncil:", properCouncil);
				setCommunityCouncil(properCouncil);
				setIsLoading(false);
			})
			.catch(error => {
				console.error("Error loading CSV:", error);
				setIsLoading(false);
			});
	}, [selectedDistrict]);

	useEffect(() => {
		if (communityCouncil) {
			setIsLoading(true);
			const csvFilePath = isAbove20K
				? "src/assets/csv/kandydaci_rada_gmin_above20k.csv"
				: "src/assets/csv/kandydaci_rady_gmin_under20k.csv";
			fetch(csvFilePath)
				.then(response => response.text())
				.then(csvText => {
					const results = Papa.parse<Candidate>(csvText, {
						header: true,
						skipEmptyLines: true,
					});
					const filteredCandidates = results.data.filter(
						candidate =>
							candidate.Gmina === selectedDistrict.Gmina &&
							candidate["Nr okręgu"] === communityCouncil["Numer okręgu"]
					);
					setCandidates(filteredCandidates);
					setIsLoading(false);
				})
				.catch(error => {
					console.error("Error loading CSV:", error);
					setIsLoading(false);
				});
		}
	}, [selectedDistrict, isAbove20K, communityCouncil]);

	useEffect(() => {
		if (candidates.length) {
			const grouped: Record<string, Candidate[]> = candidates.reduce(
				(acc: Record<string, Candidate[]>, candidate) => {
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
	}, [candidates]);

	return (
		<Box className="w-full">
			<Heading
				as="h2"
				size="lg"
				fontWeight="bold"
				mb={8}>
				Listy
			</Heading>
			{isLoading ? (
				<div className="space-y-4">
					{Array.from({ length: 3 }).map((_, index) => (
						<Skeleton
							key={`skeleton-${index}`}
							height="350px"
							width="100%"
						/>
					))}
				</div>
			) : (
				<UnorderedList
					px={0}
					spacing={4}>
					{Object.entries(groupedCandidates).map(([listNumber, candidates]) => (
						<CandidatesPartyList
							key={listNumber}
							listNumber={listNumber}
							candidates={candidates}
						/>
					))}
				</UnorderedList>
			)}
		</Box>
	);
};

export default Candidates;
