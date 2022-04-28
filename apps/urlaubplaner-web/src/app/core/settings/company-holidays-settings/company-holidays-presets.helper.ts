/** interface to make dealing with company holiday presets easier */
export interface CompanyHolidayPreset {
    label: string,
    shortHand: string,
    year: number,
    holidayDays: Date[]
}

/** HDM Wiesloch Preset 2022 */
export const wieHDMPreset: CompanyHolidayPreset = {
    label: "Heidelberger Druckmaschinen AG (Wiesloch)",
    shortHand: "HDM-WIE",
    year: 2022,
    holidayDays: [
        new Date("2022-01-03"),
        new Date("2022-01-04"),
        new Date("2022-01-05"),
        new Date("2022-01-07"),

        new Date("2022-05-27"),

        new Date("2022-06-17"),

        new Date("2022-10-31"),

        new Date("2022-12-27"),
        new Date("2022-12-28"),
        new Date("2022-12-29"),
        new Date("2022-12-30"),

        new Date("2022-08-01"),
        new Date("2022-08-02"),
        new Date("2022-08-03"),
        new Date("2022-08-04"),
        new Date("2022-08-05"),
        
        new Date("2022-08-08"),
        new Date("2022-08-09"),
        new Date("2022-08-10"),
        new Date("2022-08-11"),
        new Date("2022-08-12"),

        new Date("2022-08-15"),
        new Date("2022-08-16"),
        new Date("2022-08-17"),
        new Date("2022-08-18"),
        new Date("2022-08-19"),
    ]
}

/** map for presets used to identify easily via route queryparam in planner page component loading */
export const presetMap = new Map([
    [wieHDMPreset.shortHand, wieHDMPreset]
])