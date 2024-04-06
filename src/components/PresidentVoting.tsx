import { OrderedList, Skeleton } from "@chakra-ui/react";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import PresidentItem from "src/components/PresidentItem";
import { PresidentCandidate } from "src/types/president_type";
import { GminaItem } from "src/types/rada_gmin_types";

interface Props {
	selectedDistrict: GminaItem;
	isAbove20K?: boolean;
}

const PresidentVoting = ({ selectedDistrict }: Props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [presidentCandidates, setPresidentCandidates] = useState<
		PresidentCandidate[]
	>([]);

	useEffect(() => {
		setIsLoading(true);
		fetch("/csv/kandydaci_wbp_utf8.csv")
			.then(response => response.text())
			.then(csvText => {
				const results = Papa.parse<PresidentCandidate>(csvText, {
					header: true,
					skipEmptyLines: true,
				});
				const filteredCandidates = results.data.filter(
					president => president.Obszar === selectedDistrict.Gmina
				);
				setPresidentCandidates(filteredCandidates);
			})
			.catch(error => {
				console.error("Error loading CSV:", error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [selectedDistrict]);

	if (isLoading) {
		return (
			<Skeleton
				height="350px"
				w={"100%"}
			/>
		);
	}

	return (
		<OrderedList spacing={4}>
			{presidentCandidates?.map((presidentCandidate, index) => (
				<PresidentItem
					key={
						presidentCandidate["Nazwa komitetu"] +
						presidentCandidate["Nazwisko i imiona"] +
						index
					}
					presidentCandidate={presidentCandidate}
				/>
			))}
		</OrderedList>
	);
};

export default PresidentVoting;
