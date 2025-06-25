import prisma from '../../lib/prisma';
import {NextApiRequest, NextApiResponse} from "next";

const students = [
	{
		firstName: "Chinaza",
		middleName: "Blessing",
		lastName: "Okafor",
		email: "chinaza.okafor01@example.com",
		phone: "+2348123456701",
		class: "SS1",
		term: "First Term",
		dateOfBirth: new Date("2008-05-14"),
	},
	{
		firstName: "Ibrahim",
		middleName: "Tunde",
		lastName: "Adebayo",
		email: "ibrahim.adebayo99@example.com",
		phone: "+2348099988722",
		class: "SS2",
		term: "Second Term",
		dateOfBirth: new Date("2007-11-22"),
	},
	{
		firstName: "Emmanuella",
		middleName: "Joy",
		lastName: "Eze",
		email: "emmanuella.eze34@example.com",
		phone: "+2347034456677",
		class: "JSS2",
		term: "Third Term",
		dateOfBirth: new Date("2010-02-19"),
	},
	{
		firstName: "David",
		middleName: "Chukwuemeka",
		lastName: "Nwosu",
		email: "david.nwosu2025@example.com",
		phone: "+2349011122334",
		class: "JSS1",
		term: "First Term",
		dateOfBirth: new Date("2011-07-08"),
	},
	{
		firstName: "Fatima",
		middleName: "Aisha",
		lastName: "Mohammed",
		email: "fatima.mohammed45@example.com",
		phone: "+2348063344556",
		class: "SS3",
		term: "Third Term",
		dateOfBirth: new Date("2006-09-30"),
	},
	{
		firstName: "Samuel",
		middleName: "Oluwafemi",
		lastName: "Ogunleye",
		email: "samuel.ogunleye23@example.com",
		phone: "+2347089988771",
		class: "SS1",
		term: "Second Term",
		dateOfBirth: new Date("2008-04-16"),
	},
	{
		firstName: "Adaobi",
		middleName: "Miracle",
		lastName: "Okonkwo",
		email: "adaobi.okonkwo11@example.com",
		phone: "+2349097766554",
		class: "JSS3",
		term: "First Term",
		dateOfBirth: new Date("2009-01-23"),
	},
	{
		firstName: "Uchechukwu",
		middleName: "Henry",
		lastName: "Obi",
		email: "uche.obi89@example.com",
		phone: "+2349055554455",
		class: "SS2",
		term: "Third Term",
		dateOfBirth: new Date("2007-12-10"),
	},
	{
		firstName: "Grace",
		middleName: "Amaka",
		lastName: "Ifeanyi",
		email: "grace.ifeanyi44@example.com",
		phone: "+2348145566778",
		class: "JSS2",
		term: "Second Term",
		dateOfBirth: new Date("2010-06-02"),
	},
	{
		firstName: "Kelvin",
		middleName: "Chidera",
		lastName: "Umeh",
		email: "kelvin.umeh77@example.com",
		phone: "+2348113344556",
		class: "SS1",
		term: "First Term",
		dateOfBirth: new Date("2008-08-28"),
	},
];

export default async function POST(req: NextApiRequest, res: NextApiResponse){

	try {
		
		const data = await req.body;
		
		if (!data) {
			console.log(`no data`);
			throw new Error('No data');
		}
		
		await prisma.user.createMany({
			data: students.map(student => ({ ...student, payments: [], subscriptions: [] })),
		});
		
		console.log(`Created new user. requested from ${req.method}`);
	} catch (error) {
		console.log(`error: ${error.message}`)
	}

}

