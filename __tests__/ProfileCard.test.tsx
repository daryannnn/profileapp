import '@testing-library/jest-dom'
import {render, screen} from '@testing-library/react'
import ProfileCard from '../src/components/ProfileCard'
import * as getUserData from "../src/firebase/getUserData";

jest.mock("../src/firebase/getUserData", () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        result: {
            name: "Иван",
            profilePhotoUrl: "",
            positionName: "Новосибирск, Россия",
            categories: ["теннис"],
        },
        error: null
    }),
}))


describe('ProfileCard tests', () => {
    describe('Render tests', () => {
        it('renders an avatar without photo', () => {
            render(<ProfileCard userId={"u7bg33K1sJT7vTjzrlSi3SKQbcA3"}/>)

            const avatar = screen.getByTestId("avatar-nophoto")

            expect(avatar).toBeInTheDocument()
        })
        it('renders an avatar with photo', () => {
            render(<ProfileCard userId={"u7bg33K1sJT7vTjzrlSi3SKQbcA3"}/>)

            const avatar = screen.getByTestId("avatar-nophoto")

            expect(avatar).toBeInTheDocument()
        })

        it('renders a name', () => {
            render(<ProfileCard userId={"u7bg33K1sJT7vTjzrlSi3SKQbcA3"}/>)

            const name = screen.getByTestId("name")

            expect(name).toBeInTheDocument()
        })

        it('renders a position name', async () => {
            render(<ProfileCard userId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"}/>);

            const position = await screen.findByTestId("position")

            expect(position).toBeInTheDocument()
        })
    })

    describe('Behavior tests', () => {
        it('goes to users page', async () => {
            render(<ProfileCard userId={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"}/>);

            const link = screen.getByTestId("link-to-profile");

            expect(link).toHaveAttribute('href', '/profile/uwQpIREuHGY1b2Mu4EjXfEDw6eW2');
        })
    })
})