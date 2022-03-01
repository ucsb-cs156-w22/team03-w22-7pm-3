import { onPurgeSuccess, cellToAxiosParamsPurge } from "main/utils/EarthquakeUtils";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("EarthquakeUtils", () => {

    describe("onPurgeSuccess", () => {

        test("It puts the message on console.log and in a toast", () => {
            // arrange
            const restoreConsole = mockConsole();

            // act
            onPurgeSuccess("abc");

            // assert
            expect(mockToast).toHaveBeenCalledWith("abc");
            expect(console.log).toHaveBeenCalled();
            const message = console.log.mock.calls[0][0];
            expect(message).toMatch("abc");

            restoreConsole();
        });

    });
    describe("cellToAxiosParamsPurge", () => {

        test("It returns the correct params", () => {
            // arrange

            // act
            const result = cellToAxiosParamsPurge();

            // assert
            expect(result).toEqual({
                url: "/api/earthquakes/purge",
                method: "DELETE",
            });
        });

    });

});




