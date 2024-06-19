import '@testing-library/jest-dom'
import {fireEvent, render, screen} from '@testing-library/react'
import OrganizationRegistrationForm from "@/components/OrganizationRegistrationForm";
import * as signUp from "../src/firebase/auth/signUp";
import * as addOrganization from "../src/firebase/addOrganization";
import { useRouter } from 'next/router'
import React, { useState as useStateMock } from 'react';
import userEvent from '@testing-library/user-event'

// @ts-ignore
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
                response: {
                    GeoObjectCollection: {
                        featureMember: [{
                            GeoObject: {
                                name: "name",
                                description: "description",
                                Point: {
                                    pos: "25.197300 55.274243"
                                }
                            }
                        }]
                    }
                }
            })
    }),
);

jest.mock("../src/firebase/auth/signUp", () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock("../src/firebase/addOrganization", () => ({
    __esModule: true,
    default: jest.fn(),
}))

jest.mock('next/router', () => ({
    useRouter: jest.fn()
}))

/*jest.mock('react', () => ({
    // Returns the actual module instead of a mock,
    // bypassing all checks on whether the module should receive
    // a mock implementation or not.
    ...jest.requireActual('react'),
    useState: jest.fn()
}))
const setState = jest.fn()*/


describe('Organization registration form tests', () => {
    describe('Render tests', () => {
        it('renders an disabled button', () => {
            render(<OrganizationRegistrationForm />)

            const button = screen.getByTestId("disabled-button")

            expect(button).toBeInTheDocument()
        })
    })

    describe('Behavior tests', () => {
        it('renders an enabled button when fields are filled', async () => {
            render(<OrganizationRegistrationForm />)
            const name = screen.getByTestId("name") as HTMLInputElement;
            await userEvent.type(name, "name");
            const nickname = screen.getByTestId("nickname")
            await userEvent.type(nickname, "nickname");
            const coords = screen.getByTestId("coords")
            await userEvent.type(coords, "city");
            const description = screen.getByTestId("description")
            await userEvent.type(description, "description");
            const specialization = screen.getByTestId("spec")
            await userEvent.type(specialization, "tennis");
            const email = screen.getByTestId("email")
            await userEvent.type(email, "email@email.email");
            const password = screen.getByTestId("password")
            await userEvent.type(password, "password");

            const button = screen.getByTestId("enabled-button")

            expect(button).toBeInTheDocument()
        })
    })
})