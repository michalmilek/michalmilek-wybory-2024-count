import { Box, Button, Flex } from "@chakra-ui/react";
import { useState } from "react";
import Candidates from "src/components/Candidates";
import PresidentVoting from "src/components/PresidentVoting";
import RegionalParliament from "src/components/RegionalParliament";
import { GminaItem } from "src/types/rada_gmin_types";

enum VotingEnum {
	"Prezydenckie" = "Prezydenckie",
	"Radni" = "Radni",
	"Sejmik" = "Sejmik",
	"Powiat" = "Powiat",
}

interface Props {
	selectedDistrict: GminaItem;
	isAbove20K?: boolean;
}

const VotingType = ({ selectedDistrict, isAbove20K }: Props) => {
	const [selectedValue, setSelectedValue] = useState<VotingEnum>();

	const handleButtonClick = (value: VotingEnum) => {
		setSelectedValue(value);
	};

	return (
		<Box className="w-full">
			<Flex
				gap={4}
				mb={8}
				flexWrap={"wrap"}>
				<Button
					colorScheme={
						selectedValue === VotingEnum.Prezydenckie ? "blue" : "gray"
					}
					onClick={() => handleButtonClick(VotingEnum.Prezydenckie)}>
					Prezydenckie
				</Button>
				<Button
					colorScheme={selectedValue === VotingEnum.Radni ? "blue" : "gray"}
					onClick={() => handleButtonClick(VotingEnum.Radni)}>
					Radni
				</Button>
				<Button
					colorScheme={selectedValue === VotingEnum.Sejmik ? "blue" : "gray"}
					onClick={() => handleButtonClick(VotingEnum.Sejmik)}>
					Sejmik
				</Button>
				<Button
					colorScheme={selectedValue === VotingEnum.Powiat ? "blue" : "gray"}
					onClick={() => handleButtonClick(VotingEnum.Powiat)}>
					Powiat
				</Button>
			</Flex>
			{selectedValue === VotingEnum.Sejmik && (
				<RegionalParliament selectedDistrict={selectedDistrict} />
			)}
			{selectedValue === VotingEnum.Prezydenckie && (
				<PresidentVoting
					selectedDistrict={selectedDistrict}
					isAbove20K={isAbove20K}
				/>
			)}
			{selectedValue === VotingEnum.Radni && (
				<Candidates
					isAbove20K={isAbove20K}
					selectedDistrict={selectedDistrict}
				/>
			)}
		</Box>
	);
};

export default VotingType;
