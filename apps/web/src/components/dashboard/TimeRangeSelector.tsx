"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type TimeRange = "30d" | "7d" | "24h";

interface TimeRangeSelectorProps {
	value?: TimeRange;
	onChange?: (value: TimeRange) => void;
	liveMode?: boolean;
	onLiveModeChange?: (value: boolean) => void;
}

export default function TimeRangeSelector({
	value = "7d",
	onChange,
	liveMode = false,
	onLiveModeChange,
}: TimeRangeSelectorProps) {
	const [selected, setSelected] = useState<TimeRange>(value);
	const [isLive, setIsLive] = useState(liveMode);

	const handleSelect = (range: TimeRange) => {
		setSelected(range);
		onChange?.(range);
	};

	const handleLiveToggle = (checked: boolean) => {
		setIsLive(checked);
		onLiveModeChange?.(checked);
	};

	return (
		<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
			<div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
				<Button
					variant={selected === "30d" ? "default" : "outline"}
					size="sm"
					onClick={() => handleSelect("30d")}
					className="text-xs sm:text-sm px-2 sm:px-3 h-8 flex-1 sm:flex-none"
				>
					30 Days
				</Button>
				<Button
					variant={selected === "7d" ? "default" : "outline"}
					size="sm"
					onClick={() => handleSelect("7d")}
					className="text-xs sm:text-sm px-2 sm:px-3 h-8 flex-1 sm:flex-none"
				>
					7 Days
				</Button>
				<Button
					variant={selected === "24h" ? "default" : "outline"}
					size="sm"
					onClick={() => handleSelect("24h")}
					className="text-xs sm:text-sm px-2 sm:px-3 h-8 flex-1 sm:flex-none"
				>
					24 Hours
				</Button>
			</div>

			<div className="flex items-center gap-2 mt-2 sm:mt-0">
				<Label
					htmlFor="live-mode"
					className="text-xs sm:text-sm text-gray-600"
				>
					Live Mode
				</Label>
				<Switch
					id="live-mode"
					checked={isLive}
					onCheckedChange={handleLiveToggle}
					className="scale-90 sm:scale-100"
				/>
			</div>
		</div>
	);
}
